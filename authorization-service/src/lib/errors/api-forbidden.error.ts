import { API_MESSAGES, STATUS_CODES } from '@lib/constants';
import BaseApiError from './api.error';

export default class ApiForbiddenError extends BaseApiError {
    constructor(
        message: string = API_MESSAGES.FORBIDDEN,
        isOperational: boolean = false
    ) {
        super(STATUS_CODES.FORBIDDEN, message, isOperational);
    }
}
