import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import status from 'http-status';

import { HTTPErrorResponseJson } from '@/types/core';
import {
    DigontoError,
    DuplicateResourceError,
    ForbiddenError,
    InternalServerError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
} from '@/utils/errors';

export function errorTransformer(e: Error, c: Context) {
    const errorResponseJson: HTTPErrorResponseJson = {
        success: false,
        code: status.INTERNAL_SERVER_ERROR,
        message: status[status.INTERNAL_SERVER_ERROR],
        data: null,
    };

    if (e instanceof DigontoError) {
        errorResponseJson.code = e.code;
        errorResponseJson.message = e.message;
    }

    if (e instanceof InternalServerError) {
        console.error(errorResponseJson.message);
    }

    return c.json(errorResponseJson, errorResponseJson.code);
}
