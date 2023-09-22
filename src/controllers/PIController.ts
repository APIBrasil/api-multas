import utils from '../utils/utils';
import validation from '../validations/validation';
import puppeteer from "puppeteer";
import * as Captcha from '2captcha-ts';
import { Request, Response } from 'express';
class Pi {

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
        await page.goto(`${process.env.PI_URL}`);
        
        //form itens
        const inputPlacaSelect = await page.$('#inputPlaca');
        const inputRenavamSelect = await page.$('#inputRenavam');
        const buttonSubmitSelect = await page.$('button[id="botaoConsultar"]');

        //captcha itens
        const imageCaptchaSelect = await page.$('img[id="capimg"]');
        const inputCaptchaSelect = await page.$('input[id="inputCaptcha"]');
        const tableSelector = 'table.table.table-bordered.table-hover.table-condensed.table-striped';

        await inputPlacaSelect?.type(placa);
        await inputRenavamSelect?.type(renavam);

        const solver = new Captcha.Solver(twocaptchaapikey as string);
        const captchaBase64 = await imageCaptchaSelect?.screenshot({ encoding: 'base64' });

        solver.imageCaptcha({
            body: captchaBase64 as string,
            numeric: 4,
            min_len: 5,
            max_len: 5,
        })
        .then(async (res:any) => {

            await inputCaptchaSelect?.type(res.data);
            await buttonSubmitSelect?.click();

            await utils.sleep(5000);

            const html = await page.content();

            const cheerio = require('cheerio');
            const $ = cheerio.load(html);

            const table = $(tableSelector);

            const multas = [] as any;

            table.find('tr').each((index:any, row:any) => {
                const tr = $(row);
                const tds = tr.find('td');
                const multa = {} as any;

                tds.each((i:any, td:any) => {
                    const tdText = $(td).text();
                    const headerText = table.find('th').eq(i).text().trim(); // Obter o cabeçalho da coluna correspondente

                    if (tdText.trim() && tdText.trim() !== "R$ 0,00" && tdText.trim() !== "") {

                        let headerTextClear = utils.removeAccents(headerText).replace(/[^a-zA-Z0-9]/g, " ").replace(/\s+/g, " ").trim().toLowerCase().replace(/ (.)/g, function($1) { return $1.toUpperCase(); }).replace(/ /g, "");
                        let valueTextClear = tdText.replace(/\s+/g, " ")

                        multa[headerTextClear == "" ? "id" : headerTextClear] = valueTextClear;

                    }

                });

                if (Object.keys(multa).length > 0) {
                    if(multa.id){
                        multas.push(multa);
                    }
                }

            });

            utils.webhook(webhook, 'POST', null, JSON.stringify({
                captcha: res.data,
                placa,
                renavam,
                multas
            }));

            await browser.close();

            return res.data;
            
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

export const pi = new Pi();