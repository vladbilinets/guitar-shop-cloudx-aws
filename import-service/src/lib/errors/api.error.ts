export default class ApiError extends Error {
    constructor(
        readonly statusCode: number,
        readonly message: string,
        readonly isOperational: boolean = true
    ) {
        super(message);

        Error.captureStackTrace(this, this.constructor);

        Object.setPrototypeOf(this, new.target.prototype);
    }
}
