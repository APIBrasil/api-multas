"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class Utils {
    constructor() {
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
