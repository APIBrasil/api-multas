//strict
import utils from '../utils/utils';
import validation from '../validations/validation';
import puppeteer from "puppeteer";
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

        const browser = await puppeteer.launch({
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
        await page.goto(`${process.env.SC_URL}?placa=${placa}&renavam=${renavam}`, { waitUntil: 'networkidle2', timeout: 10000 });

        console.log('open page', page.url());
        
        const buttonSubmitSelect = await page.$('button[class="g-recaptcha"]');
        const urlCaptcha = page.url() as string;

        console.log('urlCaptcha', urlCaptcha);

        //captcha solver
        const solver = new Captcha.Solver(twocaptchaapikey as string);
        const dataSiteKeyValueFromButton = await page.evaluate((buttonSubmitSelect) => {
            return buttonSubmitSelect.getAttribute('data-sitekey');
        }, buttonSubmitSelect);

        const captchaToken = await solver.recaptcha({
            googlekey: dataSiteKeyValueFromButton as string,
            pageurl: urlCaptcha,
        });

        console.log('captchaToken', captchaToken.data);

        await page.close();

        //reload page with captchaToken.data
        const pageReload = await browser.newPage();
        await pageReload.goto(`${process.env.SC_URL}?placa=${placa}&renavam=${renavam}&g-recaptcha-response=${captchaToken.data}`, { waitUntil: 'networkidle2', timeout: 10000 });

        console.log('open pageReload', pageReload.url());

        const buttonSubmitReload = await pageReload.$('button[class="g-recaptcha"]');
        await buttonSubmitReload?.click();

        console.log('click buttonSubmitReload');

        try{

            const textoNotFound = "Nenhuma multa em aberto cadastrada para este veículo até o momento.";
            const textCaptchaInvalid = "Problema de acesso a página. Recaptcha inválido. Consulte novamente";
            await pageReload.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });

            const html = await pageReload.content();

            console.log('html', html);

            if (html.includes(textoNotFound)) {
                console.log('Nenhuma multa em aberto cadastrada para este veículo até o momento.');
                await pageReload.close();
                return { placa, renavam, multas: [], message: 'Nenhuma multa em aberto cadastrada para este veículo até o momento.' };
            }

            if (html.includes(textCaptchaInvalid)) {
                console.log('Problema de acesso a página. Recaptcha inválido. Consulte novamente');
                await pageReload.close();
                return { placa, renavam, multas: [], message: 'Problema de acesso a página. Recaptcha inválido. Consulte novamente' };
            }

            console.log('open pageReload', pageReload.url());

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

            return { placa, renavam, multas };

        }catch(e){
            
            const errorElement = await pageReload.$('div[class="alert alert-danger"]');

            const error = await pageReload.evaluate((errorElement) => {
                return errorElement.textContent;
            }, errorElement);

            console.log(e);
            await page.close();
            await pageReload.close();

            return { placa, renavam, multas: [], error };

        }

    }

}

export const sc = new SCController();