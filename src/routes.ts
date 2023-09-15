import express from 'express';
const routes = express.Router();

import { mg } from './controllers/Mg';

import validation from './validations/Mg';

routes.post('/multas/mg', async (req, res) => {

    const placa = req.body.placa as string;
    const renavam = req.body.renavam as string;

    const errors =  validation.validate(placa, renavam);

    if (errors) {
        return res.status(400).json(errors);
    }
    
    const multas = await mg.scrap(placa, renavam);

    res.status(200).json(multas);

})

export default routes;
