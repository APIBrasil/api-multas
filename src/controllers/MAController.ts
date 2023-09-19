import utils from 'src/utils/utils';
import validation from '../validations/validation';
import puppeteer from "puppeteer";

import { Request, Response } from 'express';

class Ma {

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
            timeout: 5000,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
            ]
        });
        
        const page = await browser.newPage();
        
        await page.goto(`${process.env.MA_URL}`);

        const placaSelector = '#placa';
        const renavamSelector = '#renavam';
        const linkPadraoSelector = '.link-padrao';
        const buttonsSelector = '#btn-veiculo';

        const inputPlaca = await page.$(placaSelector);
        const inputRenavam = await page.$(renavamSelector);

        await inputPlaca?.type(placa);
        await inputRenavam?.type(renavam);

        //buttonSubmit remove disabled
        
        const button = await page.$(buttonsSelector);

        //remove disabled
        await page.evaluate((button) => {
            button.removeAttribute('disabled');
        }, button);

        await button?.click();

        //get value from alert alert-danger alert-dismissible show
        const alertDanger = await page.$('.alert-danger');

        const alertDangerText = await page.evaluate((alertDanger) => {
            return alertDanger.textContent;
        }, alertDanger);


        if(alertDangerText) {
            return { message: alertDangerText };
        }

        return { placa, renavam };
    }

}

export const ma = new Ma();