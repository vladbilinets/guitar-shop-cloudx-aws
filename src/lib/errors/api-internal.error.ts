import { ERROR_MESSAGES, STATUS_CODES } from '@lib/constants';
import BaseApiError from './api.error';

export default class ApiInternalError extends BaseApiError {
    constructor(
        message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        isOperational: boolean = true
    ) {
        super(STATUS_CODES.INTERNAL_SERVER_ERROR, message, isOperational);
    }
}
