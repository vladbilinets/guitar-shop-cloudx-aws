export type HttpHeaders = Record<string, string | number>;

export type ApiResponse = {
    statusCode: number;
    body: string;
    headers: HttpHeaders;
    isBase64Encoded: boolean;
};
