import ApiError from '@lib/errors/api.error';
import { ApiResponse, HttpHeaders } from '@lib/types';
import { DEFAULT_HEADERS, STATUS_CODES } from '@lib/constants';

export const successResponse = (
    body: object,
    statusCode: number = STATUS_CODES.OK,
    headers: HttpHeaders = {}
): ApiResponse => ({
    success: true,
    statusCode,
    body: JSON.stringify(body),
    headers: {
        ...DEFAULT_HEADERS,
        ...headers
    },
    isBase64Encoded: false
});

export const errorResponse = (
    error: ApiError,
    headers: HttpHeaders = {}
): ApiResponse => ({
    success: false,
    statusCode: error.statusCode,
    body: JSON.stringify({
        message: error.message || 'Something went wrong'
    }),
    headers: {
        ...DEFAULT_HEADERS,
        ...headers
    },
    isBase64Encoded: false
});
