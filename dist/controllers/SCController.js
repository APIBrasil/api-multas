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
exports.sc = void 0;
const validation_1 = __importDefault(require("../validations/validation"));
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const user_agents_1 = __importDefault(require("user-agents"));
const Captcha = __importStar(require("2captcha-ts"));
class SCController {
    constructor() {
        this.index = async (req, res) => {
            const placa = req.body.placa;
            const renavam = req.body.renavam;
            const twocaptchaapikey = req.body.twocaptchaapikey;
            const errors = validation_1.default.generic(placa, renavam);
            if (errors) {
                return res.status(400).json(errors);
            }
            if (!twocaptchaapikey) {
                return res.status(400).json({ message: 'Informe a chave da API do 2captcha para esse DETRAN, pois o mesmo possui captcha.' });
            }
            Promise.all([
                this.scrap(placa, renavam, twocaptchaapikey),
            ]).then((values) => {
                res.status(200).json(values);
            }).catch((error) => {
                res.status(400).json({ error: error, message: 'Erro ao consultar o site do DETRAN SC.' });
            });
        };
        this.scrap = async (placa, renavam, twocaptchaapikey) => {
            puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
            const browser = await puppeteer_extra_1.default.launch({
                headless: process.env.NODE_ENV === 'production' ? 'new' : false,
                slowMo: process.env.NODE_ENV === 'production' ? 0 : 50,
                timeout: 10000,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--disable-blink-features=AutomationControlled',
                    '--disable-web-security',
                    '--disable-features=IsolateOrigins,site-per-process',
                    '--disable-extensions',
                    '--disable-plugins-discovery',
                    '--disable-remote-fonts',
                    '--disable-sync',
                    '--disable-notifications',
                ]
            });
            const page = await browser.newPage();
            const userAgent = new user_agents_1.default({ deviceCategory: 'desktop' }).toString();
            console.log(userAgent);
            // Configurar User-Agent e viewport
            await page.setUserAgent(userAgent);
            await page.setExtraHTTPHeaders({ 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' });
            await page.setJavaScriptEnabled(true);
            await page.setBypassCSP(true);
            await page.goto(`${process.env.SC_URL}?placa=${placa}&renavam=${renavam}`, { waitUntil: 'networkidle2', timeout: 10000 });
            const buttonSubmitSelect = await page.$('button[class="g-recaptcha"]');
            const urlCaptcha = page.url();
            const solver = new Captcha.Solver(twocaptchaapikey);
            const dataSiteKeyValueFromButton = await page.evaluate((buttonSubmitSelect) => {
                return buttonSubmitSelect.getAttribute('data-sitekey');
            }, buttonSubmitSelect);
            const captchaToken = await solver.recaptcha({
                googlekey: dataSiteKeyValueFromButton,
                pageurl: urlCaptcha,
            });
            await page.close();
            //reload page with captchaToken.data
            const pageReload = await browser.newPage();
            // Configurar User-Agent e viewport
            await pageReload.setUserAgent(userAgent);
            await pageReload.setExtraHTTPHeaders({ 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' });
            await pageReload.setJavaScriptEnabled(true);
            await pageReload.setBypassCSP(true);
            await pageReload.goto(`${process.env.SC_URL}?placa=${placa}&renavam=${renavam}&g-recaptcha-response=${captchaToken.data}`, { waitUntil: 'networkidle2', timeout: 10000 });
            const buttonSubmitReload = await pageReload.$('button[class="g-recaptcha"]');
            await (buttonSubmitReload === null || buttonSubmitReload === void 0 ? void 0 : buttonSubmitReload.click());
            try {
                const textoNotFound = "Nenhuma multa em aberto cadastrada para este veículo até o momento.";
                const textCaptchaInvalid = "Problema de acesso a página. Recaptcha inválido. Consulte novamente";
                await pageReload.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
                const html = await pageReload.content();
                if (html.includes(textoNotFound)) {
                    await pageReload.close();
                    await browser.close();
                    return { placa, renavam, multas: [], message: 'Nenhuma multa em aberto cadastrada para este veículo até o momento.' };
                }
                if (html.includes(textCaptchaInvalid)) {
                    await pageReload.close();
                    return { placa, renavam, multas: [], message: 'Problema de acesso a página. Recaptcha inválido. Consulte novamente' };
                }
                //new page with captcha solver
                await pageReload.waitForSelector('table[bgcolor="white"]', { timeout: 10000 });
                const tablesElementsSelects = await pageReload.$$('table[bgcolor="white"]');
                //table
                const tableElementSelect = tablesElementsSelects[2];
                const trElementsSelects = await tableElementSelect.$$('tbody > tr');
                const multas = [];
                for (const trElementSelect of trElementsSelects) {
                    const multa = {};
                    const tdElementsSelects = await trElementSelect.$$('td');
                    if (tdElementsSelects.length === 7) {
                        multa['GUIA'] = await tdElementsSelects[0].evaluate((el) => el.textContent.trim());
                        multa['Número'] = await tdElementsSelects[1].evaluate((el) => el.textContent.trim());
                        multa['Vencimento'] = await tdElementsSelects[2].evaluate((el) => el.textContent.trim());
                        multa['ValoNominal'] = await tdElementsSelects[3].evaluate((el) => el.textContent.trim());
                        multa['Multa'] = await tdElementsSelects[4].evaluate((el) => el.textContent.trim());
                        multa['Juros'] = await tdElementsSelects[5].evaluate((el) => el.textContent.trim());
                        multa['ValorAtual'] = await tdElementsSelects[6].evaluate((el) => el.textContent.trim());
                        multas.push(multa);
                    }
                }
                multas.shift();
                await pageReload.close();
                await browser.close();
                console.log(multas);
                return { placa, renavam, multas };
            }
            catch (e) {
                const errorElement = await pageReload.$('div[class="alert alert-danger"]');
                const error = await pageReload.evaluate((errorElement) => {
                    return errorElement.textContent;
                }, errorElement);
                console.log(e);
                await page.close();
                await pageReload.close();
                await browser.close();
                return { placa, renavam, multas: [], error };
            }
        };
    }
}
exports.sc = new SCController();
