import { Router } from "express";
import fs from 'fs'

const router = Router()
const pathName  = "./products.json"

router.get('/', (req,res)=>{
    fs.readFile(pathName, 'utf8', (err, data)=> {
        if (err) {
            console.log(err);
            res.status(500).json({error: 'Internal server error'})
            return;
        }

        const products = JSON.parse(data)
        res.json({products:products})
    })
}) 

export default router;