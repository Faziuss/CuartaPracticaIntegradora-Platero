import TicketModel from "./models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";

class Ticket{

    async generate(email, totalAmount){
        const ticket = {
            purchaser: email,
            code: uuidv4(),
            amount: totalAmount
        }

        await TicketModel.create(ticket)
    }

}

export default Ticket