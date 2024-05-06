import ErrorTypes from "./ErrorTypes.js";

class CustomError extends Error{
    constructor({name="error", cause, message, code=ErrorTypes.UNKOWN}){
        super(message)
        this.name = name; 
        this.code = code; 
        this.cause = cause;   
    }
}

export default CustomError