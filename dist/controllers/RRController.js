"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rr = void 0;
const validation_1 = __importDefault(require("../validations/validation"));
const puppeteer_1 = __importDefault(require("puppeteer"));
class Rr {
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
            await page.goto(`${process.env.RR_URL}`);
            //input from atribute title
            const placaSelector = 'Placa';
            const renavamSelector = '#renavam';
            const linkPadraoSelector = '.link-padrao';
            const buttonsSelector = 'button[type="submit"]';
            const inputPlaca = await page.$eval(placaSelector, el => el.getAttribute('title'));
            return { placa, renavam };
        };
    }
}
exports.rr = new Rr();
