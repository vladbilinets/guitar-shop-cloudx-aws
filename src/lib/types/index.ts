export type HttpHeaders = Record<string, string | number>;

export type ApiResponse = {
    statusCode: number;
    body: string;
    headers: HttpHeaders;
    isBase64Encoded: boolean;
};

export type Product = {
    id: string;
    title: string;
    description: string;
    count: number;
    price: number;
};
