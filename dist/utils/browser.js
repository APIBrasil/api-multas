"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const newPage = async () => {
    const open = await puppeteer_1.default.launch({
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
    const browser = await open.newPage();
    return browser;
};
exports.default = newPage;
