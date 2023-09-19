"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ma = void 0;
const validation_1 = __importDefault(require("../validations/validation"));
const puppeteer_1 = __importDefault(require("puppeteer"));
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
            await page.goto(`${process.env.MA_URL}`);
            const placaSelector = '#placa';
            const renavamSelector = '#renavam';
            const linkPadraoSelector = '.link-padrao';
            const buttonsSelector = '#btn-veiculo';
            const inputPlaca = await page.$(placaSelector);
            const inputRenavam = await page.$(renavamSelector);
            await (inputPlaca === null || inputPlaca === void 0 ? void 0 : inputPlaca.type(placa));
            await (inputRenavam === null || inputRenavam === void 0 ? void 0 : inputRenavam.type(renavam));
            //buttonSubmit remove disabled
            const button = await page.$(buttonsSelector);
            //remove disabled
            await page.evaluate((button) => {
                button.removeAttribute('disabled');
            }, button);
            await (button === null || button === void 0 ? void 0 : button.click());
            //get value from alert alert-danger alert-dismissible show
            const alertDanger = await page.$('.alert-danger');
            const alertDangerText = await page.evaluate((alertDanger) => {
                return alertDanger.textContent;
            }, alertDanger);
            if (alertDangerText) {
                return { message: alertDangerText };
            }
            return { placa, renavam };
        };
    }
}
exports.ma = new Ma();
