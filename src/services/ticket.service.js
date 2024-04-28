class TicketService{
    constructor(dao){
        this.dao = dao
    }

    async generate(email, totalAmount){
        await this.dao.generate(email,totalAmount)
    }

    async getTicketByEmail(email){
        return await this.dao.getTicketByEmail(email)
    }
}

export default TicketService;