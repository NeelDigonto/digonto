export const codeExamples = {
  ormPoolConfig: `// Initial problematic configuration
const ormConfig = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: false,
  entities: [...],
  poolSize: 10, // Single pool for all queries
};`,
  segregatedPools: `// Segregated pool configuration
const criticalPool = new DataSource({
  ...baseConfig,
  name: 'critical',
  poolSize: 5, // Dedicated pool for critical queries
});

const regularPool = new DataSource({
  ...baseConfig,
  name: 'regular',
  poolSize: 15, // Larger pool for regular operations
});

// Usage in services
class SessionService {
  async getActiveSession(sessionId: string) {
    // Use critical pool for important reads
    return criticalPool.getRepository(Session)
      .findOne({ where: { id: sessionId } });
  }
  
  async updateSessionMetrics(data: UpdateData) {
    // Use regular pool for batch updates
    return regularPool.getRepository(Session)
      .update({ id: data.sessionId }, data.metrics);
  }
}`,
  performanceTuning: `// Performance optimizations applied
// 1. Multi-column index for hot paths
@Index(['participantId', 'status', 'createdAt'])
@Entity()
class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  participantId: string;
  
  @Column()
  status: SessionStatus;
  
  @CreateDateColumn()
  createdAt: Date;
}

// 2. Query optimization with proper joins
const sessions = await queryBuilder
  .leftJoinAndSelect('session.participants', 'participant')
  .where('session.status = :status', { status: 'active' })
  .andWhere('participant.joinedAt > :time', { 
    time: new Date(Date.now() - 3600000) 
  })
  .useIndex('idx_participant_status_created') // Force index usage
  .getMany();

// 3. Move frequent updates to Redis
await redis.hset(
  \`session:\${sessionId}\`,
  'lastHeartbeat', 
  Date.now()
);`,
};
