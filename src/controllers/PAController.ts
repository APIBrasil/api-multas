import utils from '../utils/utils';
import validation from '../validations/validation';
import puppeteer from "puppeteer";
import * as Captcha from '2captcha-ts';
import { Request, Response } from 'express';
class Pa {

    index = async (req: Request, res: Response) => {

        const placa = req.body.placa as string;
        const renavam = req.body.renavam as string;
        const webhook = req.body.webhook as string;
        const twocaptchaapikey = req.body.twocaptchaapikey as string;

        const errors =  validation.generic(placa, renavam);
    
        if (errors) {
            return res.status(400).json(errors);
        }
        
        if(!twocaptchaapikey){
            return res.status(400).json({ message: 'Informe a chave da API do 2captcha para esse DETRAN, pois o mesmo possui captcha.' });
        }

        await this.scrap(placa, renavam, twocaptchaapikey, webhook);
        
        res.status(200).json({
            placa,
            renavam,
            message: 'As multas serão enviadas para o webhook',
            webhook: webhook
        });
        
    } 

    scrap = async (placa: string, renavam: string, twocaptchaapikey:string, webhook:string) => {

        const browser = await puppeteer.launch({
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
        await page.goto(`${process.env.PA_URL}`);
        
        // forms
        const inputPlacaSelect = await page.$('input[maxlength="7"]');
        const inputRenavamSelect = await page.$('input[maxlength="11"]');

        // captcha
        const inputCaptchaSelect = await page.$('input[id="indexRenavam:senha"]');
        const imageCaptchaSelect = await page.$('img[id="indexRenavam:captcha"]');
        
        // submit
        const inputSubmitSelect = await page.$('input[id="indexRenavam:confirma"]');

        //set values
        await inputPlacaSelect?.type(placa);
        await inputRenavamSelect?.type(renavam);

        const captchaBase64 = await utils.imageFileToBase64(imageCaptchaSelect);

        const solver = new Captcha.Solver(twocaptchaapikey as string);

        solver.imageCaptcha({
            body: captchaBase64 as string,
            numeric: 4,
            min_len: 5,
            max_len: 5,
        })
        .then(async (res:any) => {

            inputCaptchaSelect?.type(res.data);
            inputSubmitSelect?.click();
            
            const multas = [] as any;

            try{
                    
                await page.waitForSelector("table[class='stilo_dataTable']", { timeout: 5000 });

                const ths = await page.$$('table[class="stilo_dataTable"] th');
                const trs = await page.$$('table[class="stilo_dataTable"] tbody tr');

                await Promise.all(trs.map(async (tr, i) => {

                    const multa = {} as any;
                    const tds = await tr.$$('td');

                    await Promise.all(tds.map(async (td, j) => {
                        const tdText = await td.evaluate((el) => el.textContent.trim().replace(/\s+/g, " "));
                        const thText = utils.removeAccents(await ths[j].evaluate((el) => el.textContent.trim())).replace(/[^a-zA-Z0-9]/g, " ").replace(/\s+/g, " ").trim().toLowerCase().replace(/ (.)/g, function($1) { return $1.toUpperCase(); }).replace(/ /g, "");
                        multa[thText] = tdText;
                    }));

                    if (Object.keys(multa).length > 0) {
                        multas.push(multa);
                    }

                }));

                utils.webhook(webhook, 'POST', null, {
                    placa,
                    renavam,
                    multas
                });

            }catch(err){

                const errorElementSelect = await page.$$('.errors');
                const error = await errorElementSelect[0].evaluate((el) => el.textContent.trim());

                utils.webhook(webhook, 'POST', null, {
                    placa,
                    renavam,
                    error
                });

            }
            
            await browser.close();

        })
        .catch(async (err) => {
            
            utils.webhook(webhook, 'POST', null, {
                placa, renavam, multas: [], error: 'Erro ao resolver captcha'
            });

            await browser.close();
            return { message:'Erro ao resolver captcha', error: err};

        })

    }

}

export const pa = new Pa();