import utils from 'src/utils/utils';
import validation from '../validations/validation';
import puppeteer from "puppeteer";

import { Request, Response } from 'express';

class Rr {

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
        
        await page.goto(`${process.env.RR_URL}`);

        //input from atribute title
        const placaSelector = 'Placa';
        
        const renavamSelector = '#renavam';
        const linkPadraoSelector = '.link-padrao';
        const buttonsSelector = 'button[type="submit"]';

        const inputPlaca = await page.$eval(placaSelector, el => el.getAttribute('title'));
        


        return { placa, renavam };
    }

}

export const rr = new Rr();