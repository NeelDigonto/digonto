import {
    ClientErrorStatusCode,
    ContentfulStatusCode,
    ServerErrorStatusCode,
} from 'hono/utils/http-status';

// Re-export core types from shared schemas
export {
    WSClientEventType,
    WSServerEventType,
    clientSchemaMap,
    serverSchemaMap,
    rootWSClientRequestSchema,
    rootWSServerResponseSchema,
    type RootWSClientRequest,
    type RootWSServerResponse,
} from '@digonto/shared-schemas';

export interface HTTPErrorResponseJson {
    success: false;
    code: ClientErrorStatusCode | ServerErrorStatusCode;
    message: string;
    data: object | null;
}
