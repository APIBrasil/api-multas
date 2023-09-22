"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.am = void 0;
const utils_1 = __importDefault(require("src/utils/utils"));
const validation_1 = __importDefault(require("../validations/validation"));
class Am {
    constructor() {
        this.index = async (req, res) => {
            const placa = req.body.placa;
            const renavam = req.body.renavam;
            const errors = validation_1.default.generic(placa, renavam);
            if (errors) {
                return res.status(400).json(errors);
            }
            const multas = await this.scrap(placa, renavam);
            res.status(200).json(multas);
        };
        this.scrap = async (placa, renavam) => {
            try {
                const response = await utils_1.default.request(`${process.env.AM_URL}/?renavam=${renavam}`, 'GET', {
                    'Accept-Encoding': 'gzip',
                    'Host': 'www.detran.am.gov.br',
                    'User-Agent': 'okhttp/3.12.12',
                    'Accept': 'application/json'
                }, {});
                const data = response.data;
                return { placa, renavam, data };
            }
            catch (error) {
                return { placa, renavam, error: error.message };
            }
        };
    }
}
exports.am = new Am();
