"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.br = void 0;
const utils_1 = __importDefault(require("../utils/utils"));
const validation_1 = __importDefault(require("../validations/validation"));
class Br {
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
                const payload = await utils_1.default.request(`https://api.detran.df.gov.br/app/vinculo-veiculo/area-publica/buscaVeiculo/${placa}/${renavam}?user_key=${process.env.BR_KEY}`, 'GET', {
                    'Connection': 'Keep-Alive',
                    'Accept': 'application/json, text/plain, */*',
                    'Host': 'api.detran.df.gov.br',
                    'User-Agent': 'okhttp/4.9.2',
                    'Content-Type': 'application/json',
                    'X-Application-Context': 'application:prod:8080',
                    'X-OneAgent-JS-Injection': true,
                    'X-XSS-Protection': '1; mode=block',
                }, null);
                const debitos = payload;
                return debitos;
            }
            catch (e) {
                return { message: 'Não foi possível fazer login no DETRAN BR', error: e.message };
            }
        };
    }
}
exports.br = new Br();
