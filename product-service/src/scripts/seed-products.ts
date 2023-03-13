import * as uuid from 'uuid';
import { ProductService } from '@lib/services';
import { ProductDTO } from '@lib/types';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
const randomProductDto = (): ProductDTO => ({
    id: uuid.v4(),
    title: `Guitar ${uuid.v4()}`,
    description: `Description ${uuid.v4()}`,
    price: randomInt(100, 5000),
    count: randomInt(1, 9)
});

async function seedProducts(count: number = 5) {
    const productService = new ProductService();
    const products: ProductDTO[] = [...Array(count)].map(randomProductDto);

    await Promise.all(products.map(productService.createProduct.bind(productService)));
}

(async function() {
    await seedProducts();
})();
