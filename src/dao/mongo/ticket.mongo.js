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

    async getTicketByEmail(email){
        const ticket = TicketModel.find({purchaser: email}).lean()
        return ticket
    }

}

export default Ticket