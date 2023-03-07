import { IProduct, IStock, ProductDTO } from '@lib/types';
import DbClient from '@lib/utils/db-client';
import config from '@config/index';
import * as uuid from 'uuid'
import { ProductMapper } from '@lib/mappers';
import { Converter } from 'aws-sdk/clients/dynamodb';

export default class ProductService {
    private dbClient: DbClient;

    constructor() {
        this.dbClient = new DbClient();
    }

    public async getAll(): Promise<ProductDTO[]> {
        const products = await this.dbClient.getAll<IProduct>(config.db.tables.products);
        const stocks = await this.dbClient.getAll<IStock>(config.db.tables.stock);

        return products.map((product) => ProductMapper.toDto(
            product,
            stocks.find(({ product_id }) => product_id === product.id)
        ));
    }

    public async getById(id: string): Promise<ProductDTO | undefined> {
        const product = await this.dbClient.getOne<IProduct>(config.db.tables.products, { id });

        if (!product) {
            return undefined;
        }

        const productStock = await this.dbClient.getOne<IStock>(config.db.tables.stock, { product_id: product.id });

        return ProductMapper.toDto(product, productStock);
    }

    public async createProduct(productDto: Omit<ProductDTO, 'id'>): Promise<void> {
        productDto.id = uuid.v4();

        const product = ProductMapper.dtoToProduct(productDto as ProductDTO);
        const stock = ProductMapper.dtoToStock(productDto as ProductDTO);

        await this.dbClient.transaction([
            { Put: { Item: Converter.marshall(product), TableName: config.db.tables.products } },
            { Put: { Item: Converter.marshall(stock), TableName: config.db.tables.stock } },
        ]);
    }
}
