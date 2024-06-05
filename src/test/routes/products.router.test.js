import {expect} from 'chai';
import supertest from 'supertest';
const request = supertest("http://localhost:8080");

describe('/api/products tests', function() {
    before(function() {
        this.productMock = {
            title: 'Test Product',
            description: 'This is a test product',
            price: 100,
            stock: 10,
            category: 'Electronics',
            code: 'TEST123'
        };
    });

    it('Debe crear un producto correctamente', async function() {
        const { _body, statusCode } = await request.post('/api/products').send(this.productMock);
        expect(_body).to.exist;
        expect(statusCode).to.be.equal(200);
        expect(_body.payload).to.have.property('_id');
        //this.productMock._id = _body.payload._id;
    });

    it('Debe obtener un producto por ID', async function() {
        const { _body, statusCode } = await request.get(`/api/products/${this.productMock._id}`);
        expect(statusCode).to.be.equal(200);
        expect(_body.payload).to.have.property('_id', this.productMock._id);
    });

    it('Debe actualizar el producto correctamente', async function() {
        const updatedData = { price: 120 };
        await request.put(`/api/products/${this.productMock._id}`).send(updatedData);
        const { _body, statusCode } = await request.get(`/api/products/${this.productMock._id}`);
        expect(statusCode).to.be.equal(200);
        expect(_body.payload).to.have.property('price', 120);
    });
});