import * as uuid from 'uuid';
import { IProduct, IStock, ProductDTO } from '@lib/types';

export default class ProductMapper {
    public static dtoToProduct(dto: ProductDTO): IProduct {
        return {
            id: dto.id,
            title: dto.title,
            description: dto.description,
            price: dto.price
        };
    }

    public static dtoToStock(dto: ProductDTO): IStock {
        return {
            id: uuid.v4(),
            product_id: dto.id,
            count: dto.count
        }
    }

    public static toDto(product: IProduct, stock: IStock | undefined = undefined): ProductDTO {
        return {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            count: stock?.count || 0
        };
    }
}
