"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes = express_1.default.Router();
const Mg_1 = require("./controllers/Mg");
const Al_1 = require("./controllers/Al");
const validation_1 = __importDefault(require("./validations/validation"));
routes.post('/multas/mg', async (req, res) => {
    const placa = req.body.placa;
    const renavam = req.body.renavam;
    const errors = validation_1.default.generic(placa, renavam);
    if (errors) {
        return res.status(400).json(errors);
    }
    const multas = await Mg_1.mg.scrap(placa, renavam);
    res.status(200).json(multas);
});
routes.post('/multas/al', async (req, res) => {
    const placa = req.body.placa;
    const renavam = req.body.renavam;
    const errors = validation_1.default.generic(placa, renavam);
    console.log(errors);
    if (errors) {
        return res.status(400).json(errors);
    }
    const multas = await Al_1.al.scrap(placa, renavam);
    res.status(200).json(multas);
});
exports.default = routes;
