import { faker } from "@faker-js/faker";

const generateProducts = () => {

    const product = {
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        code: faker.string.uuid(),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.number.int({ min: 0, max: 100 }),
        category: faker.helpers.arrayElement(['PC', 'PlayStation 4', 'Xbox One', 'Nintendo DS']),
        thumbnails: [faker.image.url()],
        id: faker.database.mongodbObjectId()
    }

    return product
}

export default generateProducts