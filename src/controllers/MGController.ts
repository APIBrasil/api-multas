import utils from '../utils/utils';
import validation from '../validations/validation';
import puppeteer from "puppeteer";
import { Request, Response } from 'express';

class Mg {

    index = async (req: Request, res: Response) => {

        const placa = req.body.placa as string;
        const renavam = req.body.renavam as string;
    
        const errors =  validation.generic(placa, renavam);
    
        if (errors) {
            return res.status(400).json(errors);
        }
        
        const multas = await this.scrap(placa, renavam);
    
        res.status(200).json(multas);
        
    } 

    scrap = async (placa: string, renavam: string) => {

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
        
        await page.goto(`${process.env.MG_URL}`, { waitUntil: 'networkidle2', timeout: 10000 });

        const placaSelector = '#placa';
        const renavamSelector = '#renavam';
        const linkPadraoSelector = '.link-padrao';
        const buttonsSelector = 'button[type="submit"]';
        const tableSelector = 'table > tbody > tr';

        const inputPlaca = await page.$(placaSelector);
        const inputRenavam = await page.$(renavamSelector);

        await inputPlaca?.type(placa);
        await inputRenavam?.type(renavam);

        const buttons = await page.$$(buttonsSelector);
        const buttonSubmit = buttons[1];

        await buttonSubmit?.click();

        try {
            
            await page.waitForSelector(linkPadraoSelector, { timeout: 1000 });

        } catch (error) {
            await browser.close();
            return { placa, renavam, message: 'Não foi possível encontrar multas para este veículo.' };
        }

        const linkPadrao = await page.$(linkPadraoSelector);

        await linkPadrao?.click();

        await page.waitForSelector(tableSelector);
        const trs = await page.$$(tableSelector);

        const multas = [] as any[];

        await Promise.all(trs.map(async (tr) => {

            const tds = await tr.$$('td');

            const content = await Promise.all(tds.map(async (td) => {
                const text = await page.evaluate((el) => el.textContent, td);
                return text;
            }));

            //[0] = Sequência
            //[1] = Processo
            //[2] = Descricao
            //[3] = Local
            //[4] = Valor

            multas.push({
                sequencia: content[0],
                processo: content[1],
                descricao: content[2],
                local: content[3],
                valor: utils.convertStringToDecimal(content[4]),
            });

            return content;

        }));

        await browser.close();

        return { placa, renavam, multas };
    }

}

export const mg = new Mg();