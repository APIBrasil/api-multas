import utils from 'src/utils/utils';
import validation from '../validations/validation';
import puppeteer from "puppeteer";

import FormData from 'form-data';

import { Request, Response } from 'express';


class Am {

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

        try{

            const response = await utils.request(`${process.env.AM_URL}/?renavam=${renavam}`, 'GET', {
                'Accept-Encoding': 'gzip',
                'Host': 'www.detran.am.gov.br',
                'User-Agent': 'okhttp/3.12.12',
                'Accept': 'application/json'
            }, {});

            const data = response.data;

            return { placa, renavam, data };
    
        } catch (error: any) {

            return { placa, renavam, error: error.message };

        }

 
    }
    
}

export const am = new Am();