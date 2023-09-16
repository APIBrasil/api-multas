"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pb = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const validation_1 = __importDefault(require("../validations/validation"));
class PB {
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
            const browser = await puppeteer_1.default.launch({
                headless: process.env.NODE_ENV === 'production' ? 'new' : false,
                slowMo: process.env.NODE_ENV === 'production' ? 0 : 50,
                timeout: 5000,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                ]
            });
            const page = await browser.newPage();
            placa = placa.replace(/[^a-zA-Z0-9]/g, '');
            renavam = renavam.replace(/[^0-9]/g, '');
            //GET all tables with=646
            const tableSelector = 'table[width="648"]';
            await page.goto(`${process.env.PB_URL}/BBDT_MULTABOLETO_CLIENTE/MultaBoleto?placa=${placa}&renavam=${renavam}&opcao=I&display=web&redirect=ok`);
            const tds = await page.$$eval('td[width="28%"]', tds => tds.map(td => td.innerText));
            if (tds[1].includes('Erro:')) {
                const error = tds[1].split('Erro: ')[1].split(' [ Voltar ]')[0];
                return { error: error.replace(/(\r\n|\n|\r)/gm, "").replace('[ Voltar ]', '') };
            }
            const tables = await page.$$(tableSelector).then((tables) => {
                return tables;
            });
            console.log(tables[0]);
            if (tds[1].includes('Erro:')) {
                const error = tds[1].split('Erro: ')[1].split(' [ Voltar ]')[0].replace(/(\r\n|\n|\r)/gm, "").replace('[ Voltar ]', '');
                // Se houver um erro, retorne um objeto JSON com a chave "error"
                return { error };
            }
            //get all tr and tds from table[0]
            const multas = await tables[0].$$eval('tr', trs => trs.map(tr => tr.innerText));
            const dados = await tables[1].$$eval('tr', trs => trs.map(tr => tr.innerText));
            console.log(multas);
            console.log(dados);
            const boleto = {};
            // {
            //     numero: boleto_multa[0],
            //     vencimento: boleto_multa[1],
            //     valor: boleto_multa[2],
            //     situacao: boleto_multa[3],
            //     data_pagamento: boleto_multa[4],
            //     valor_pago: boleto_multa[5],
            // }
            // await browser.close();
            return { placa, renavam, multas, dados };
        };
    }
}
exports.pb = new PB();
