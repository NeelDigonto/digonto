# The incident that taught me importance of data pipeline segregation

## The incident that changed my view of ORM pools

It was a usual Sunday afternoon, things were chill and suddenly I hear the typical/ familiar Slack notification.

It was my manager tagging me on a live-suppport incident.

```
sessions.getActiveSession calls are timing out on recording-ms
```

(repalce with slack pic)

I saw the message and immediately knew it was trouble. We were hosting a 5000 participant webinar, which I could already assume went far from ideal.

Sessions is a critical micro-service, relied upon by recording microservice, AI related workers like live-transcription, etc.

I looked around slack and recent threads started by SRE team regarding heavy CPU usage on AWS RDS and the on-call guy was getting paged about the service degradation.

The scene was serious and being the maintainer of session's microservice, I was quite concerned.

So, the initial presumption was PG got choked and all queries were hung.

I started to simulate using a local script callignn preprod nodes on k8s, everything went fine.

Bombarded the DB with millions of queries, slow but all fine went fine.

We were like, wtf?

[we thought something up with our pods on k8s]

We tried one more time, running our script, plus running a few queries manually to our prepod k8s pod connected to the same DB.
Bang, the queries got stuck now.

Many theories came to mind.

1. Is our pod hanging up, nope..
2. Is our DB hanging up, nope ...
3. The sync queries were executed fine.

What could it be?

We tried directly hitting the DB, worked fine..

Then we arried at the conclution, the DB is not the problem, it was the data pipeline.

The important createSession & getActiveSession queries were waiting behind numerous DB update queries.

The incoming pipeline was big and saturating the ORM pool, and the unlucky but important queries were waiting for the pool to become free.

The Rabitmq prefetch was set at 40, but only 10 ORM connection was available. With load spiking and each PJ taking ~200ms, at any time there were at least 40 queries waiting to get hands on the ORM pool, we arrive at 40 \* 200ms = 8secs, before the important query can be executed. Creating more pods will increase the concurrency easily, but the DB will still be under load taking each PJ to ~200ms, therefore the important query will wait. But remember that the DB is not choked it's just a bit slow.

Therefore when we reaalized this, we understood that our important queries needs a different ORM pool which could give it a congestion free access to the DB, and can be prioritized.
We did so, and instantly saw the important query read time droping from >5secs to <50ms.

Not only this, but we aggresively tuned sessions-ms that day.

1. Make sure our joins were using proper index, fixed 2 queries joining 20mil+ row without and index, and instantly make overall queries 5x faster.
2. Added multi-column index on a hot path, where postgres refused to use the sequential joins.
3. Move most of the frequent udpate operations to Redis, drastically reducing DB locks.
4. Increased ORM pool size from 10 to 40 per pod: we arrived at this value by stress testing at what concurency do we reach ~50% CPU usage.
5. Also, we made the other services more resilient and not depend on sessiosn to avoid future issues.

It's been over a year now, and hardly ever have we faced sessions-ms performance degrade, even though our paltform usage grew at 100% in each quarters.
