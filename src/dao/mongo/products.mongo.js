import ProductModel from "./models/products.model.js";
import { AppError } from "../../helpers/AppError.js";
import CustomError from "../../utils/CustomError.js";
import { getInvalidIdInfo } from "../../utils/info.js";
import ErrorTypes from "../../utils/ErrorTypes.js";

class Products {
  constructor() {
    console.log("new instance of dbmanager");
  }

  async getProductsApi(ReqQuery) {
    let { query, sort } = ReqQuery;
    let opt = {};

    let limit = ReqQuery.limit || 10;
    let page = ReqQuery.page || 1;

    if (query) {
      opt = JSON.parse(query);
    }

    if (limit && (isNaN(limit) || Number(limit) < 0)) {
      throw new AppError(400, { message: "Invalid limit query." });
    }

    let sortOption = {};
    if (sort === "asc") {
      sortOption = { price: 1 };
    } else if (sort === "desc") {
      sortOption = { price: -1 };
    }

    const options = {
      page,
      limit,
      sort: sortOption,
      lean: true,
    };

    let result = await ProductModel.paginate(opt, options);

    return result;
  }

  async getProducts() {
    let result = await ProductModel.find();
    return result;
  }

  async addProduct(body) {
    let result = await ProductModel.create(body);
    return result;
  }

  async getProductById(id) {
    const foundProduct = await ProductModel.findOne({ _id: id });

    if (!foundProduct) {
      throw new CustomError({
        name: 'Unexisting id param error',
        cause: getInvalidIdInfo(id),
        message: 'No se encontró el Producto.',
        code: ErrorTypes.INVALID_ID_ERROR
    })
    }
    return foundProduct;
  }

  async updateProduct(pid, upProd) {
    const result = await ProductModel.findByIdAndUpdate(pid, upProd, {
      new: true,
    });

    if (result === null) {
      throw new CustomError({
        name: 'Unexisting id param error',
        cause: getInvalidIdInfo(pid),
        message: 'No se encontró el Producto.',
        code: ErrorTypes.INVALID_ID_ERROR
    })
    }
  }

  async deleteProduct(pid) {
    const product = await ProductModel.deleteOne({ _id: pid });
    if (product.deletedCount === 0) {
      throw new CustomError({
        name: 'Unexisting id param error',
        cause: getInvalidIdInfo(pid),
        message: 'No se encontró el Producto.',
        code: ErrorTypes.INVALID_ID_ERROR
    })
    }
  }
}

export default Products;
