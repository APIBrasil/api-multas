"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.se = void 0;
const utils_1 = __importDefault(require("../utils/utils"));
class Se {
    constructor() {
        this.index = async (req, res) => {
            const renavam = req.body.renavam;
            if (!renavam.match(/^[0-9]+$/)) {
                return res.status(400).json({ message: 'Renavam inválido' });
            }
            const multas = await this.scrap(renavam);
            res.status(200).json(multas);
        };
        this.scrap = async (renavam) => {
            try {
                const payload = await utils_1.default.request(`${process.env.SE_URL}/${renavam}/0`, 'GET', {
                    'Accept-Encoding': 'gzip',
                    'Host': 'www.detran.se.gov.br',
                    'User-Agent': 'okhttp/3.12.12',
                    'Accept': 'application/json'
                }, null);
                const debitos = payload;
                return debitos;
            }
            catch (e) {
                return { message: 'Não foi possível fazer login no DETRAN SE', error: e.message };
            }
        };
    }
}
exports.se = new Se();
