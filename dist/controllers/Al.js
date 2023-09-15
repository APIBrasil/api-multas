"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.al = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
class Al {
    constructor() {
        this.scrap = async (placa, renavam) => {
            const browser = await puppeteer_1.default.launch({
                headless: 'new',
                slowMo: 50,
                timeout: 5000,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                ]
            });
            const page = await browser.newPage();
            await page.goto('https://www.detran.al.gov.br/veiculos/guia_infracoes/');
            const placaSelector = '#id_placa';
            const renavamSelector = '#id_renavam';
            // const linkPadraoSelector = '.link-padrao';
            const buttonsSelector = 'button[type="submit"]';
            const inputPlaca = await page.$(placaSelector);
            const inputRenavam = await page.$(renavamSelector);
            renavam = renavam.replace(/[^0-9]/g, '');
            placa = placa.replace(/[^a-zA-Z0-9]/g, '');
            await (inputPlaca === null || inputPlaca === void 0 ? void 0 : inputPlaca.type(placa));
            await (inputRenavam === null || inputRenavam === void 0 ? void 0 : inputRenavam.type(renavam));
            const buttons = await page.$$(buttonsSelector);
            const buttonSubmit = buttons[1];
            await (buttonSubmit === null || buttonSubmit === void 0 ? void 0 : buttonSubmit.click());
            await browser.close();
            return { message: 'Scraping is not implemented yet' };
        };
        this.convertStringToDecimal = (value) => {
            return Number(value.replace('R$ ', '').replace('.', '').replace(',', '.'));
        };
    }
}
exports.al = new Al();
