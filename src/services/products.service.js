class ProductService {
  constructor(dao) {
    this.dao = dao;
  }
  async getProducts() {
    return await this.dao.getProducts();
  }
  async getProductsApi(query) {
    return await this.dao.getProductsApi(query);
  }
  async getProductById(pid) {
    return await this.dao.getProductById(pid);
  }
  async addProduct(body) {
    return this.dao.addProduct(body);
  }
  async updateProduct(pid, upProd) {
    await this.dao.updateProduct(pid, upProd);
  }
  async deleteProduct(pid) {
    return await this.dao.deleteProduct(pid);
  }
}

export default ProductService;
