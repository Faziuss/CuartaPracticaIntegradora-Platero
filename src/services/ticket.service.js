class TicketService{
    constructor(dao){
        this.dao = dao
    }

    async generate(email, totalAmount){
        await this.dao.generate(email,totalAmount)
    }
}

export default TicketService;