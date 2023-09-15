"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mg = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
class Mg {
    constructor() {
        this.scrap = async (placa, renavam) => {
            const browser = await puppeteer_1.default.launch({
                headless: 'new',
                slowMo: 0,
                timeout: 5000,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                ]
            });
            //open new page
            const page = await browser.newPage();
            //go to url
            await page.goto('https://www.detran.mg.gov.br/veiculos/situacao-do-veiculo/emitir-de-extrato-de-multas');
            //#placa
            //#renavam
            const placaSelector = '#placa';
            const renavamSelector = '#renavam';
            const linkPadraoSelector = '.link-padrao';
            const buttonsSelector = 'button[type="submit"]';
            const tableSelector = 'table > tbody > tr';
            const inputPlaca = await page.$(placaSelector);
            const inputRenavam = await page.$(renavamSelector);
            //remove caracters special or letters
            renavam = renavam.replace(/[^0-9]/g, '');
            //remove caracters special placa
            placa = placa.replace(/[^a-zA-Z0-9]/g, '');
            await (inputPlaca === null || inputPlaca === void 0 ? void 0 : inputPlaca.type(placa));
            await (inputRenavam === null || inputRenavam === void 0 ? void 0 : inputRenavam.type(renavam));
            //click to button two
            const buttons = await page.$$(buttonsSelector);
            const buttonSubmit = buttons[1];
            await (buttonSubmit === null || buttonSubmit === void 0 ? void 0 : buttonSubmit.click());
            try {
                await page.waitForSelector(linkPadraoSelector, { timeout: 5000 });
            }
            catch (error) {
                await browser.close();
                return { placa, renavam, multas: [] };
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
                    valor: this.convertStringToDecimal(content[4]),
                });
                return content;
            }));
            await browser.close();
            return { placa, renavam, multas };
        };
        this.convertStringToDecimal = (value) => {
            return Number(value.replace('R$ ', '').replace('.', '').replace(',', '.'));
        };
    }
}
exports.mg = new Mg().scrap;
