// Set the prototype explicitly to maintain the correct prototype chain
import { RedirectStatusCode, ClientErrorStatusCode, ServerErrorStatusCode } from 'hono/utils/http-status';
import status from 'http-status';

export class DigontoError extends Error {
    constructor(
        message: string,
        public readonly code: ClientErrorStatusCode | ServerErrorStatusCode,
    ) {
        super(message);
        this.name = 'DigontoError';
        Object.setPrototypeOf(this, DigontoError.prototype);
    }
}

export class InternalServerError extends DigontoError {
    constructor(message: string) {
        super(message, status.INTERNAL_SERVER_ERROR);
        this.name = 'InternalServerError';
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}

export class DuplicateResourceError extends DigontoError {
    constructor(message: string) {
        super(message, status.CONFLICT);
        this.name = 'DuplicateResourceError';
        Object.setPrototypeOf(this, DuplicateResourceError.prototype);
    }
}

export class UnauthorizedError extends DigontoError {
    constructor(message: string) {
        super(message, status.UNAUTHORIZED);
        this.name = 'UnauthorizedError';
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

export class ValidationError extends DigontoError {
    constructor(message: string) {
        super(message, status.BAD_REQUEST);
        this.name = 'ValidationError';
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export class ResourceNotFoundError extends DigontoError {
    constructor(message: string) {
        super(message, status.NOT_FOUND);
        this.name = 'ResourceNotFoundError';
        Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
    }
}

export class ForbiddenError extends DigontoError {
    constructor(message: string) {
        super(message, status.FORBIDDEN);
        this.name = 'ForbiddenError';
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}
