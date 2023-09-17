"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.go = void 0;
const utils_1 = __importDefault(require("src/utils/utils"));
const validation_1 = __importDefault(require("../validations/validation"));
class Go {
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
                const bearerToken = await utils_1.default.request(`${process.env.GO_URL}/token`, 'POST', {
                    'Origin': 'https://www.go.gov.br',
                    'Referer': 'https://www.go.gov.br/',
                    'Content-Type': 'application/x-www-form-urlencoded',
                }, {
                    'grant_type': 'client_credentials',
                    'client_id': 'Uxw0W7lCNcM6fsewGxvDChLcEAEa',
                    'client_secret': 'JPU7TYzkDzafwmfgG2POSrUsbgEa'
                });
                const token = bearerToken.access_token;
                const consultarVeiculoPorPlacaRenavam = await this.consultaVeiculoPorPlacaRenavam(placa, renavam, token);
                return consultarVeiculoPorPlacaRenavam;
            }
            catch (e) {
                return { message: 'Não foi possível fazer login no DETRAN GO' };
            }
        };
        this.consultaVeiculoPorPlacaRenavam = async (placa, renavam, token) => {
            const sessionString = '{"sistema":"SSEDI","codgChave":"EKH1A40","codgTipoChave":"03","idServico":13679,"idSessao":"","ip":"179.221.165.221"}';
            const sessionBase64 = Buffer.from(sessionString).toString('base64');
            try {
                const payload = await utils_1.default.request(`${process.env.GO_URL}/detran/financeiro/1.0.0/sedi/financeiro/consultarVeiculoPorPlacaRenavam?placa=${placa}&renavam=${renavam}`, 'GET', {
                    'Origin': 'https://www.go.gov.br',
                    'Referer': 'https://www.go.gov.br/',
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                    "Session": sessionBase64
                }, null);
                const debitos = payload;
                return { placa, renavam, debitos };
            }
            catch (e) {
                return { message: 'Não foi possível consultar o veículo' };
            }
        };
    }
}
exports.go = new Go();
