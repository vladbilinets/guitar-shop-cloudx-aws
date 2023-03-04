import { ERROR_MESSAGES, STATUS_CODES } from '@lib/constants';
import BaseApiError from './api.error';

export default class ApiBadRequestError extends BaseApiError {
    constructor(
        message: string = ERROR_MESSAGES.BAD_REQUEST,
        isOperational: boolean = false
    ) {
        super(STATUS_CODES.BAD_REQUEST, message, isOperational);
    }
}
