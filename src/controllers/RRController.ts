import utils from 'src/utils/utils';
import validation from '../validations/validation';
import puppeteer from "puppeteer";

import {solveCaptcha} from 'nocaptchaai-puppeteer';

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
        

        // console.log(solve);

        //get input placa from placeholder value
        const inputPlacaSelect = await page.$('input[placeholder="BWC1140"]');
        const inputRenavamSelect = await page.$('input[placeholder="12345678910"]');
        const buttonSubmit = await page.$('button[id="submeter"]');

        console.log(inputPlacaSelect);

        //set placa value
        await inputPlacaSelect?.type(placa);

        //set renavam value
        await inputRenavamSelect?.type(renavam);

        //click submit button
        await buttonSubmit?.click();

        const solve = await solveCaptcha(page, 'jhowbhz-6a18c640-af9b-c170-01d3-51c5aa795610', 'u124', 'free', true);

        console.log(solve);

        return { placa, renavam };
    }

}

export const rr = new Rr();