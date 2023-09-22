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
const axios_1 = __importDefault(require("axios"));
const Captcha = __importStar(require("2captcha"));
class Utils {
    constructor() {
        this.imageCaptcha = async (page, input, output, submit) => {
            const solver = new Captcha.Solver(process.env.TWOCAPTCHA_KEY);
            const captchaBase64 = await this.imageFileToBase64(await page.$(input));
            const buttonSubmit = await page.$(submit);
            const captchaSolver = await solver.imageCaptcha({
                body: captchaBase64,
                numeric: 4,
                min_len: 0,
                max_len: 5,
            })
                .then(async (response) => {
                const inputCaptcha = await page.$(output);
                await (inputCaptcha === null || inputCaptcha === void 0 ? void 0 : inputCaptcha.type(response.data));
                await (buttonSubmit === null || buttonSubmit === void 0 ? void 0 : buttonSubmit.click());
                return response.data;
            })
                .catch((error) => {
                console.log(error);
                return false;
            });
            return captchaSolver;
        };
        this.imageFileToBase64 = async (image) => {
            const base64 = await image.screenshot({
                encoding: 'base64',
            });
            return base64;
        };
        this.sleep = (ms) => {
            console.log(`Sleeping for ${ms}ms`);
            return new Promise(resolve => setTimeout(resolve, ms));
        };
        this.clearString = (value) => {
            const stringClear = value.replace(/(<([^>]+)>)/gi, "").replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ").trim();
            return stringClear;
        };
        this.convertStringToDecimal = (value) => {
            return Number(value.replace('R$', '').replace('.', '').replace(',', '.').replace('R$ ', ''));
        };
        this.webhook = async (url, method, header, body) => {
            this.request(url, method ? method : 'POST', header ? header : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Detran-PI Scraper'
            }, body ? body : {});
        };
        this.request = async (url, method, headers, body) => {
            const response = await axios_1.default.request({
                url,
                method,
                headers,
                data: body
            });
            return response.data;
        };
    }
    removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
}
exports.default = new Utils();
