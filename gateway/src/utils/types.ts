import { ClientErrorStatusCode, RedirectStatusCode, ServerErrorStatusCode } from 'hono/utils/http-status';

export interface HTTPErrorResponseJson {
    success: false;
    code: ClientErrorStatusCode | ServerErrorStatusCode;
    message: string;
    data: object | null;
}
