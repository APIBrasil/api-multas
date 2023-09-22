"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ma = void 0;
const utils_1 = __importDefault(require("src/utils/utils"));
const validation_1 = __importDefault(require("../validations/validation"));
const form_data_1 = __importDefault(require("form-data"));
class Ma {
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
            let data = new form_data_1.default();
            data.append('placa', placa);
            data.append('renavam', renavam);
            const payload = await utils_1.default.request(`${process.env.MA_URL}`, 'POST', {
                'Accept-Encoding': 'gzip',
                'User-Agent': 'okhttp/3.12.12',
                'Accept': 'application/json'
            }, data);
            if (payload.includes('alert alert-danger')) {
                let contentFromHtml = payload.split('<div class="alert alert-danger alert-dismissible show" role="alert">')[1];
                contentFromHtml = contentFromHtml.split('\r\n')[1].trim();
                return { message: contentFromHtml };
            }
            const idVeiculo = payload.split('<input type="hidden" name="idVeiculo" id="idVeiculo" value="')[1].split('"')[0];
            const idAcesso = payload.split('<input type="hidden" name="idAcesso" id="idAcesso" value="')[1].split('"')[0];
            const documentoProprietario = payload.split('<input type="hidden" name="documentoProprietario" id="documentoProprietario" value="')[1].split('"')[0];
            const chassi = payload.split('<input type="hidden" name="chassi" id="chassi" value="')[1].split('"')[0];
            //https://portal.detrannet.detran.ma.gov.br/Veiculo/Extrato/MultasVeiculo.cshtml
            const urlInfracoes = "https://portal.detrannet.detran.ma.gov.br/Veiculo/Extrato/MultasVeiculo.cshtml";
            let formInfracoes = new form_data_1.default();
            formInfracoes.append('idVeiculo', idVeiculo);
            //form data with idVeiculo post
            const requestInfracoes = await utils_1.default.request(urlInfracoes, 'POST', { ...data.getHeaders() }, formInfracoes);
            const tableBody = requestInfracoes.split('<tbody>')[1].split('</tbody>')[0].split('<tr>');
            const infracoes = [];
            for (let i = 1; i < tableBody.length; i++) {
                //remove html tags special characters spaces and line breaks
                const tableRow = tableBody[i].split('</td>');
                const numeroAuto = utils_1.default.clearString(tableRow[0].split('<td>')[1]);
                const descricao = utils_1.default.clearString(tableRow[1].split('<td>')[1]);
                const localComplemento = utils_1.default.clearString(tableRow[2].split('<td>')[1]);
                const valor = utils_1.default.convertStringToDecimal(utils_1.default.clearString(tableRow[3].split('<td>')[1]));
                //Em Aberto
                infracoes.push({
                    numeroAuto,
                    descricao,
                    localComplemento,
                    valor,
                });
            }
            let formAutuacoes = new form_data_1.default();
            formAutuacoes.append('idVeiculo', idVeiculo);
            const urlAutuacoes = "https://portal.detrannet.detran.ma.gov.br/Veiculo/Extrato/AutuacoesVeiculo.cshtml";
            const requestAutuacoes = await utils_1.default.request(urlAutuacoes, 'POST', { ...data.getHeaders() }, formAutuacoes);
            const tableBodyAutuacoes = requestAutuacoes.split('<tbody>')[1].split('</tbody>')[0].split('<tr>');
            const autuacoes = [];
            for (let i = 1; i < tableBodyAutuacoes.length; i++) {
                //remove html tags special characters spaces and line breaks
                const tableRow = tableBodyAutuacoes[i].split('</td>');
                const numeroAuto = utils_1.default.clearString(tableRow[0].split('<td>')[1]);
                const descricao = utils_1.default.clearString(tableRow[1].split('<td>')[1]);
                const localComplemento = utils_1.default.clearString(tableRow[2].split('<td>')[1]);
                const valor = utils_1.default.convertStringToDecimal(utils_1.default.clearString(tableRow[3].split('<td>')[1]));
                //Em Aberto
                autuacoes.push({
                    numeroAuto,
                    descricao,
                    localComplemento,
                    valor,
                });
            }
            return {
                veiculo: {
                    idVeiculo,
                    idAcesso,
                    documentoProprietario,
                    chassi,
                },
                placa,
                renavam,
                autuacoes,
                infracoes
            };
        };
    }
}
exports.ma = new Ma();
