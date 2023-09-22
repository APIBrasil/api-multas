"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mg = void 0;
const utils_1 = __importDefault(require("../utils/utils"));
const validation_1 = __importDefault(require("../validations/validation"));
const puppeteer_1 = __importDefault(require("puppeteer"));
class Mg {
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
            await page.goto(`${process.env.MG_URL}`);
            const placaSelector = '#placa';
            const renavamSelector = '#renavam';
            const linkPadraoSelector = '.link-padrao';
            const buttonsSelector = 'button[type="submit"]';
            const tableSelector = 'table > tbody > tr';
            const inputPlaca = await page.$(placaSelector);
            const inputRenavam = await page.$(renavamSelector);
            await (inputPlaca === null || inputPlaca === void 0 ? void 0 : inputPlaca.type(placa));
            await (inputRenavam === null || inputRenavam === void 0 ? void 0 : inputRenavam.type(renavam));
            const buttons = await page.$$(buttonsSelector);
            const buttonSubmit = buttons[1];
            await (buttonSubmit === null || buttonSubmit === void 0 ? void 0 : buttonSubmit.click());
            try {
                await page.waitForSelector(linkPadraoSelector, { timeout: 1000 });
            }
            catch (error) {
                await browser.close();
                return { placa, renavam, message: 'Não foi possível encontrar multas para este veículo.' };
            }
            const linkPadrao = await page.$(linkPadraoSelector);
            await (linkPadrao === null || linkPadrao === void 0 ? void 0 : linkPadrao.click());
            await page.waitForSelector(tableSelector);
            const trs = await page.$$(tableSelector);
            const multas = [];
            await Promise.all(trs.map(async (tr) => {
                const tds = await tr.$$('td');
                const content = await Promise.all(tds.map(async (td) => {
                    const text = await page.evaluate((el) => el.textContent, td);
                    return text;
                }));
                //[0] = Sequência
                //[1] = Processo
                //[2] = Descricao
                //[3] = Local
                //[4] = Valor
                multas.push({
                    sequencia: content[0],
                    processo: content[1],
                    descricao: content[2],
                    local: content[3],
                    valor: utils_1.default.convertStringToDecimal(content[4]),
                });
                return content;
            }));
            await browser.close();
            return { placa, renavam, multas };
        };
    }
}
exports.mg = new Mg();
