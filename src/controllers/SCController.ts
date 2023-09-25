//strict
import utils from '../utils/utils';
import validation from '../validations/validation';
import puppeteer from "puppeteer-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import useragent from 'user-agents';

import * as Captcha from '2captcha-ts';
import { Request, Response } from 'express';

class SCController {

    index = async (req: Request, res: Response) => {

        const placa = req.body.placa as string;
        const renavam = req.body.renavam as string;
        const twocaptchaapikey = req.body.twocaptchaapikey as string;

        const errors =  validation.generic(placa, renavam);
        
        if (errors) {
            return res.status(400).json(errors);
        }

        if(!twocaptchaapikey){
            return res.status(400).json({ message: 'Informe a chave da API do 2captcha para esse DETRAN, pois o mesmo possui captcha.' });
        }
    
        Promise.all([
            
            this.scrap(placa, renavam, twocaptchaapikey),

        ]).then((values) => {
            
            res.status(200).json(values);
        
        }).catch((error) => {
        
            res.status(400).json({error: error, message: 'Erro ao consultar o site do DETRAN SC.'});
        
        });

    }

    scrap = async (placa: string, renavam: string, twocaptchaapikey:string) => {

        puppeteer.use(StealthPlugin());

        const browser = await puppeteer.launch({
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

        const userAgent = new useragent({ deviceCategory: 'desktop', platform: 'Win32', vendor: 'Google Inc.', viewportHeight: 1080, viewportWidth: 1920 }).toString();

        console.log(userAgent);

        // Configurar User-Agent e viewport
        await page.setUserAgent(userAgent);
        await page.setExtraHTTPHeaders({ 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' });
        await page.setJavaScriptEnabled(true);
        await page.setBypassCSP(true);

        await page.goto(`${process.env.SC_URL}?placa=${placa}&renavam=${renavam}`, { waitUntil: 'networkidle2', timeout: 10000 });
        const buttonSubmitSelect = await page.$('button[class="g-recaptcha"]');
        const urlCaptcha = page.url() as string;

        const solver = new Captcha.Solver(twocaptchaapikey as string);
        const dataSiteKeyValueFromButton = await page.evaluate((buttonSubmitSelect) => {
            return buttonSubmitSelect.getAttribute('data-sitekey');
        }, buttonSubmitSelect);

        const captchaToken = await solver.recaptcha({
            googlekey: dataSiteKeyValueFromButton as string,
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
        await buttonSubmitReload?.click();

        try{

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

            const multas = [] as any;

            for (const trElementSelect of trElementsSelects) {

                const multa = {} as any;
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

        }catch(e){
            
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


    }

}

export const sc = new SCController();