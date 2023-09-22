"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pr = void 0;
const utils_1 = __importDefault(require("../utils/utils"));
class Pr {
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
                const payload = await utils_1.default.request(`${process.env.PR_URL}/${renavam}`, 'GET', {
                    'Accept-Charset': 'UTF-8',
                    'Accept-Encoding': 'gzip',
                    'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description, Origin, X-Requested-With, Accept',
                    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
                    'Access-Control-Allow-Origin': '*',
                    'Connection': 'Keep-Alive',
                    'Host': 'www.wsutils.detran.pr.gov.br',
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 9; SM-G973N Build/PQ3A.190605.05171606)',
                    'Version': '1.1.5',
                    'X-Date': `${new Date().toISOString()}`
                }, null);
                const response = payload;
                return response;
            }
            catch (e) {
                return { message: 'Não foi possível fazer login no DETRAN PR', error: e.message };
            }
        };
    }
}
exports.pr = new Pr();
