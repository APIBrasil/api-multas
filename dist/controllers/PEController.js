"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pe = void 0;
const utils_1 = __importDefault(require("src/utils/utils"));
const validation_1 = __importDefault(require("../validations/validation"));
class Pe {
    constructor() {
        this.index = async (req, res) => {
            const renavam = req.body.renavam;
            const placa = req.body.placa;
            const errors = validation_1.default.generic(placa, renavam);
            if (errors) {
                return res.status(400).json(errors);
            }
            const multas = await this.scrap(renavam);
            res.status(200).json(multas);
        };
        this.scrap = async (placa) => {
            try {
                const payload = await utils_1.default.request(`${process.env.PE_URL}/${placa}/PE`, 'GET', {
                    'Accept-Encoding': 'identity',
                    'Connection': 'Keep-Alive',
                    'Content-Type': 'application/json; charset=utf-8;',
                    'Host': 'online7.detran.pe.gov.br',
                    'User-Agent': 'Appcelerator Titanium/8.3.1 (SM-G973N; Android API Level: 28; pt-PT;)',
                    'X-Requested-With': 'XMLHttpRequest',
                }, null);
                const response = payload;
                return response;
            }
            catch (e) {
                console.log(e);
                return { message: 'Não foi possível fazer login no DETRAN PE', error: e.message };
            }
        };
    }
}
exports.pe = new Pe();
