class CartService {
  constructor(dao) {
    console.log(dao);
    this.dao = dao;
  }

  async createCart() {
    return await this.dao.createCart();
  }

  async getCartById(cid) {
    const cart = await this.dao.getCartById(cid);
    if (!cart) {
      throw new AppError(404, { message: "Carrito no encontrado" });
    }
    return cart;
  }
  async addProductToCart(cid, pid) {
    await this.dao.addProductToCart(cid, pid);
  }

  async deleteCartProduct(cid, pid) {
    await this.dao.deleteCartProduct(cid, pid);
  }
  async updateAllCartProducts(cid, products) {
    await this.dao.updateAllCartProducts(cid, products);
  }

  async updateCartProductQuantity(cid, pid, body) {
    await this.dao.updateCartProductQuantity(cid, pid, body);
  }
  async deleteAllCartProducts(cid) {
    await this.dao.deleteAllCartProducts(cid);
  }
}

export default CartService;
