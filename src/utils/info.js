export const getInvalidIdInfo = (id)=>{
    return `Se esperaba un id existente, se recibió: ${id}`
}

export const getInvalidIdTypeInfo = (id) =>{
    return `Se esperaba un id de tipo ObjectId de mongoose, se recibió: ${id}`
}