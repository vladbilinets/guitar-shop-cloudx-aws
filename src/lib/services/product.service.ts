import { productsMock } from '@lib/mocks';
import { Product } from '@lib/types';

export default class ProductService {
    public async getAll(): Promise<Product[]> {
        return productsMock;
    }

    public async getById(id: string): Promise<Product | undefined> {
        return productsMock.find((product) => product.id === id);
    }
}
