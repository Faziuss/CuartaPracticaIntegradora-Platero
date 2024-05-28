import Carts from "../dao/mongo/carts.mongo.js";
import Products from "../dao/mongo/products.mongo.js"
import Ticket from "../dao/mongo/ticket.mongo.js";
import CartService from "../services/carts.service.js";
import ProductService from "../services/products.service.js";
import TicketService from "../services/ticket.service.js";
import UsersService from "../services/user.service.js";
import User from "../dao/mongo/users.mongo.js";

export const cartService = new CartService(new Carts())
export const productService = new ProductService(new Products())
export const ticketService = new TicketService(new Ticket())
export const usersService = new UsersService(new User());