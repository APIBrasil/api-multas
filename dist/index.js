"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mg_1 = require("./scrap/mg");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/multas/mg', async (req, res) => {
    const placa = req.body.placa;
    const renavam = req.body.renavam;
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
    const multas = await (0, mg_1.mg)(placa, renavam);
    res.json(multas);
});
app.listen(2222, () => {
    console.log('Server is running on port 3000');
});
