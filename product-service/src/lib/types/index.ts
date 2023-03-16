export type HttpHeaders = Record<string, string | number>;

export type ApiResponse = {
    statusCode: number;
    body: string;
    headers: HttpHeaders;
    isBase64Encoded: boolean;
};

export interface IEntity {
    id: string;
    [key: string]: number | string | boolean | Array<number> | Array<string> | null | undefined;
}

export interface IProduct extends IEntity {
    title: string;
    description: string;
    price: number;
}

export interface IStock extends IEntity {
    product_id: string;
    count: number;
}

export interface ProductDTO extends IProduct {
    count: IStock['count'];
}
