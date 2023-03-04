const ERROR_MESSAGES = (() => ({
    // default
    NOT_FOUND: 'Not found',
    BAD_REQUEST: 'Bad request',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    SOMETHING_WENT_WRONG: 'Something went wrong!',

    // products service
    PRODUCT_NOT_FOUND: 'Product not found',
    PRODUCTS_NOT_FOUND: 'Products not found',
    PRODUCT_ID_NOT_PROVIDED: '\'productId\' was not provided'
}))();

export default ERROR_MESSAGES;
