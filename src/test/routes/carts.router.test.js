import {expect} from 'chai';
import supertest from 'supertest';
const request = supertest("http://localhost:8080");

describe('/api/carts tests', function() {
    before(async function() {
        this.productMock = {
            title: 'Test Product',
            description: 'This is a test product',
            price: 100,
            stock: 10,
            category: 'Electronics',
            code: 'TEST123'
        };

        const { _body } = await request.post('/api/products').send(this.productMock);
        this.productMock._id = _body.payload._id;
    });

    it('Debe crear un nuevo carrito correctamente', async function() {
        const { _body, statusCode } = await request.post('/api/carts');
        expect(_body).to.exist;
        expect(statusCode).to.be.equal(200);
        expect(_body).to.have.property('status', 'success');
        expect(_body).to.have.property('id');
        this.cartMock = { _id: _body.id };
    });

    it('Debe agregar un producto al carrito', async function() {
        const { _body, statusCode } = await request.post(`/api/carts/${this.cartMock._id}/product/${this.productMock._id}`);
        expect(statusCode).to.be.equal(200);
        expect(_body).to.have.property('status', 'success');
        expect(_body).to.have.property('message', 'Producto agregado exitosamente al carrito');
    });

    it('Debe obtener el carrito por ID', async function() {
        const { _body, statusCode } = await request.get(`/api/carts/${this.cartMock._id}`);
        expect(statusCode).to.be.equal(200);
        expect(_body).to.have.property('status', 'success');
        expect(_body.payload).to.have.property('_id', this.cartMock._id);
        expect(_body.payload.products).to.be.an('array').that.is.not.empty;
        expect(_body.payload.products[0]).to.have.property('product');
        expect(_body.payload.products[0].product).to.have.property('_id', this.productMock._id);
    });
});