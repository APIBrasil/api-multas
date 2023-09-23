"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ms = void 0;
const utils_1 = __importDefault(require("../utils/utils"));
const validation_1 = __importDefault(require("../validations/validation"));
class Ms {
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
            const headers = {
                'Host': 'web.detran.ms.gov.br',
                'Origin': 'https://www.meudetran.ms.gov.br',
                'Referer': 'https://www.meudetran.ms.gov.br/veiculo_filtro_cnt/',
                'Dtn-Auth-Token': '9851B392-41DF-8060-C3A2-81240E3AEBD6',
                'Content-Type': 'text/plain',
            };
            let data = `AEANPA10                                                                                            ${placa}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         1${renavam}`;
            const request = await utils_1.default.request(`${process.env.MS_URL}`, 'POST', headers, data);
            const dataResponse = {};
            const response = await request;
            // RENAAM INFORMADO NAO PERTENCE
            if (response.indexOf('RENAVAM INFORMADO NAO PERTENCE') !== -1) {
                return { error: `O renavam ${renavam} não pertence à placa ${placa}` };
            }
            // NAO CADASTRADO NA BASE
            if (response.indexOf('NAO CADASTRADO NA BASE') !== -1) {
                return { error: `O veículo ${placa} não está cadastrado na base MS` };
            }
            // Dividir o texto em partes
            const parts = response.split(/\s+/);
            // Explorar "00000023477EXISTEM" autuações em dataResponse
            const splitedForAutuacoes = response.indexOf('AUTUACOES') !== -1 ? response.split('AUTUACOES')[0].split(/\s+/) : false;
            if (splitedForAutuacoes) {
                dataResponse['autuacoes'] = splitedForAutuacoes[5];
            }
            const coresVeiculosBrasil = [
                "BRANCO",
                "BRANCA",
                "PRETO",
                "PRETA",
                "PRATA",
                "CINZA",
                "VERMELHO",
                "AZUL",
                "VERDE",
                "AMARELO",
                "MARROM",
                "BEGE",
                "DOURADO",
                "LARANJA",
                "ROSA",
                "ROXO",
                "VINHO",
                "FANTASIA",
                "OUTRA",
                "OUTRO",
                "NAO INFORMADA"
            ];
            // Procurar cores em parts
            const matches = parts.filter((item) => {
                return coresVeiculosBrasil.includes(item.toUpperCase());
            });
            if (matches.length > 0) {
                dataResponse['cor'] = matches[0];
            }
            // IPVA
            const splitedForIpva = response.indexOf('IPVA') !== -1 ? response.split('IPVA')[1].split(/\s+/) : false;
            if (splitedForIpva) {
                dataResponse['ipva'] = splitedForIpva[1];
            }
            //"NAO HA DEBITOS PARA ESTE VEICULO"
            if (response.indexOf('NAO HA DEBITOS PARA ESTE VEICULO') !== -1) {
                return { error: `Não há débitos para o veículo ${placa}` };
            }
            // LIC.:
            const splitedForLic = response.indexOf('LIC.:') !== -1 ? response.split('LIC.:')[1].split(/\s+/) : false;
            if (splitedForLic) {
                dataResponse['licenciamento'] = splitedForLic[0];
            }
            dataResponse['placa'] = placa;
            dataResponse['renavam'] = renavam;
            // Partes contêm a string "MULTAS"
            const splitedForNumber = response.indexOf('MULTAS') !== -1 ? response.split('MULTAS')[1].split(/\s+/) : false;
            if (splitedForNumber) {
                const multas = splitedForNumber.filter((item) => {
                    // Transforme a string em número decimal com 2 casas decimais
                    item = parseFloat(item).toFixed(2);
                    return item > 0;
                });
                //filter multas com valores diferentes
                const multasValues = splitedForNumber.filter((item) => {
                    // Transforme a string em número decimal com 2 casas decimais
                    item = parseFloat(item).toFixed(2);
                    return item > 0;
                }).filter((item, index, self) => {
                    return index === self.indexOf(item);
                });
                dataResponse['valores'] = multasValues.map((item) => utils_1.default.convertStringToDecimal(item));
            }
            return dataResponse;
        };
    }
}
exports.ms = new Ms();
