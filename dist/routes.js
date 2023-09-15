"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes = express_1.default.Router();
const Mg_1 = require("./controllers/Mg");
const Mg_2 = __importDefault(require("./validations/Mg"));
routes.post('/multas/mg', async (req, res) => {
    const placa = req.body.placa;
    const renavam = req.body.renavam;
    const errors = Mg_2.default.validate(placa, renavam);
    if (errors) {
        return res.status(400).json(errors);
    }
    const multas = await Mg_1.mg.scrap(placa, renavam);
    res.status(200).json(multas);
});
exports.default = routes;
