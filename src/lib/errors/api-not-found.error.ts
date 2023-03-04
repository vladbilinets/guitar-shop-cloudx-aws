import { ERROR_MESSAGES, STATUS_CODES } from '@lib/constants';
import BaseApiError from './api.error';

export default class ApiNotFoundError extends BaseApiError {
    constructor(
        message: string = ERROR_MESSAGES.NOT_FOUND,
        isOperational: boolean = false
    ) {
        super(STATUS_CODES.NOT_FOUND, message, isOperational);
    }
}
