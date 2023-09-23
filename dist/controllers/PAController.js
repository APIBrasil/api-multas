"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pa = void 0;
const utils_1 = __importDefault(require("../utils/utils"));
const validation_1 = __importDefault(require("../validations/validation"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const Captcha = __importStar(require("2captcha-ts"));
class Pa {
    constructor() {
        this.index = async (req, res) => {
            const placa = req.body.placa;
            const renavam = req.body.renavam;
            const webhook = req.body.webhook;
            const twocaptchaapikey = req.body.twocaptchaapikey;
            const errors = validation_1.default.generic(placa, renavam);
            if (errors) {
                return res.status(400).json(errors);
            }
            if (!twocaptchaapikey) {
                return res.status(400).json({ message: 'Informe a chave da API do 2captcha para esse DETRAN, pois o mesmo possui captcha.' });
            }
            await this.scrap(placa, renavam, twocaptchaapikey, webhook);
            res.status(200).json({
                placa,
                renavam,
                message: 'As multas serão enviadas para o webhook',
                webhook: webhook
            });
        };
        this.scrap = async (placa, renavam, twocaptchaapikey, webhook) => {
            const browser = await puppeteer_1.default.launch({
                headless: process.env.NODE_ENV === 'production' ? 'new' : false,
                slowMo: process.env.NODE_ENV === 'production' ? 0 : 50,
                timeout: 10000,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                ]
            });
            const page = await browser.newPage();
            await page.goto(`${process.env.PA_URL}`, { waitUntil: 'networkidle2', timeout: 10000 });
            // forms
            const inputPlacaSelect = await page.$('input[maxlength="7"]');
            const inputRenavamSelect = await page.$('input[maxlength="11"]');
            // captcha
            const inputCaptchaSelect = await page.$('input[id="indexRenavam:senha"]');
            const imageCaptchaSelect = await page.$('img[id="indexRenavam:captcha"]');
            // submit
            const inputSubmitSelect = await page.$('input[id="indexRenavam:confirma"]');
            //set values
            await (inputPlacaSelect === null || inputPlacaSelect === void 0 ? void 0 : inputPlacaSelect.type(placa));
            await (inputRenavamSelect === null || inputRenavamSelect === void 0 ? void 0 : inputRenavamSelect.type(renavam));
            const captchaBase64 = await utils_1.default.imageFileToBase64(imageCaptchaSelect);
            const solver = new Captcha.Solver(twocaptchaapikey);
            solver.imageCaptcha({
                body: captchaBase64,
                numeric: 4,
                min_len: 5,
                max_len: 5,
            })
                .then(async (res) => {
                inputCaptchaSelect === null || inputCaptchaSelect === void 0 ? void 0 : inputCaptchaSelect.type(res.data);
                inputSubmitSelect === null || inputSubmitSelect === void 0 ? void 0 : inputSubmitSelect.click();
                const multas = [];
                try {
                    await page.waitForSelector("table[class='stilo_dataTable']", { timeout: 10000 });
                    const ths = await page.$$('table[class="stilo_dataTable"] th');
                    const trs = await page.$$('table[class="stilo_dataTable"] tbody tr');
                    await Promise.all(trs.map(async (tr, i) => {
                        const multa = {};
                        const tds = await tr.$$('td');
                        await Promise.all(tds.map(async (td, j) => {
                            const tdText = await td.evaluate((el) => el.textContent.trim().replace(/\s+/g, " "));
                            const thText = utils_1.default.removeAccents(await ths[j].evaluate((el) => el.textContent.trim())).replace(/[^a-zA-Z0-9]/g, " ").replace(/\s+/g, " ").trim().toLowerCase().replace(/ (.)/g, function ($1) { return $1.toUpperCase(); }).replace(/ /g, "");
                            multa[thText] = tdText;
                        }));
                        if (Object.keys(multa).length > 0) {
                            multas.push(multa);
                        }
                    }));
                    utils_1.default.webhook(webhook, 'POST', null, {
                        placa,
                        renavam,
                        multas
                    });
                }
                catch (err) {
                    const errorElementSelect = await page.$$('.errors');
                    const error = await errorElementSelect[0].evaluate((el) => el.textContent.trim());
                    utils_1.default.webhook(webhook, 'POST', null, {
                        placa,
                        renavam,
                        error
                    });
                }
                await browser.close();
            })
                .catch(async (err) => {
                utils_1.default.webhook(webhook, 'POST', null, {
                    placa, renavam, multas: [], error: 'Erro ao resolver captcha'
                });
                await browser.close();
                return { message: 'Erro ao resolver captcha', error: err };
            });
        };
    }
}
exports.pa = new Pa();
