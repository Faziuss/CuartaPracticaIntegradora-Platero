import ErrorTypes from "../utils/ErrorTypes";

const errorHandling = (error, req, res, next)=>{
    console.log(error.cause)
    switch (error.code) {
        case ErrorTypes.INVALID_TYPE_ERROR:
            res.status(400).send({status:'error', error: error.name})
            break;
        case ErrorTypes.INVALID_ID_ERROR:
            res.status(400).send({status:'error', error: error.name})
            break;
        
        default:
            res.status(500).send({status:'error', error: 'Unhadled error'})
            break;
    } 
}

export default errorHandling