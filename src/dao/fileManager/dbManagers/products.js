import ProductModel from "../models/products.model.js";

class Products {
  constructor() {
    console.log("new instance of dbmanager");
  }

  getProducts = async () => {
    let products = await ProductModel.find().lean();
    return products;
  };

  addProduct = async (body) => {
    let result = await ProductModel.create(body);
    return result;
  };

  getProductById = async (id) => {
    const foundProduct = await ProductModel.findOne({ _id: id });
    return foundProduct
  };

  updateProduct = async (pid, upProd) => {
    const product = await ProductModel.findByIdAndUpdate(pid , upProd , {new:true})
    return product;
  };

  deleteProduct = async (pid) => {
    const product = await ProductModel.deleteOne({ _id: pid });
    return product
  };
}

export default Products;
