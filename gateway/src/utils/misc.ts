import { CentralAPIServer } from '@/server/CentralAPIServer';
import { RootWSServerResponse, WSServerEventType } from '@/types/core';
import { WSDeps } from '@/types/misc';

export function tryGracefulAppExit(
    app: CentralAPIServer,
    resolve: () => void,
    reject: (err: Error) => void,
): void {
    app.stop()
        .then(() => {
            resolve();
        })
        .catch((err: unknown) => {
            if (err instanceof Error) {
                reject(err);
            }

            reject(new Error('An error during Server Stop'));
        });
}

export function sendWSEvent<T>(type: WSServerEventType, data: any, deps: WSDeps): void {
    const message: RootWSServerResponse = {
        timestamp: new Date().toISOString(),
        id: crypto.randomUUID(),
        referenceId: deps.eventReferenceId,
        type,
        data,
        error: null, // Set to null if no error
    };

    // console.log('Sending WebSocket event:', message);

    try {
        const event = JSON.stringify(message);
        deps.ws.send(event);
    } catch (error) {
        console.error('Error sending WebSocket message:', error);
    }
}
