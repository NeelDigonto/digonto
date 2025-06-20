import { CentralAPIServer } from '@/server/CentralAPIServer';

export function tryGracefulAppExit(app: CentralAPIServer, resolve: () => void, reject: (err: Error) => void): void {
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
