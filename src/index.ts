import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { mg } from './scrap/mg';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.post('/multas/mg', async (req, res) => {

    const placa = req.body.placa as string;
    const renavam = req.body.renavam as string;

    if (!placa) {
        return res.status(400).json({ error: 'Placa is required' });
    }

    if (placa.length < 6 || placa.length > 7) {
        return res.status(400).json({ error: 'Placa is not valid' });
    }

    if (!renavam) {
        return res.status(400).json({ error: 'Renavam is required' });
    }

    if (renavam.length < 9 || renavam.length > 11) {
        return res.status(400).json({ error: 'Renavam is not valid' });
    }

    const multas = await mg(placa, renavam);

    res.json(multas);

})

app.listen(2222, () => {
    console.log('Server is running on port 3000');
});

