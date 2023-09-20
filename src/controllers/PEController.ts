import utils from 'src/utils/utils';
import validation from '../validations/validation';

import { Request, Response } from 'express';

class Pe {

    index = async (req: Request, res: Response) => {

        const renavam = req.body.renavam as string;
        const placa = req.body.placa as string;

        const errors =  validation.generic(placa, renavam);

        if (errors) {
            return res.status(400).json(errors);
        }
        
        const multas = await this.scrap(renavam);
    
        res.status(200).json(multas);
        
    } 
    
    scrap = async (placa: string) => {

        try{

            const payload = await utils.request(`${process.env.PE_URL}/${placa}/PE`, 'GET', {
                'Accept-Encoding': 'identity',
                'Connection': 'Keep-Alive',
                'Content-Type': 'application/json; charset=utf-8;',
                'Host': 'online7.detran.pe.gov.br',
                'User-Agent': 'Appcelerator Titanium/8.3.1 (SM-G973N; Android API Level: 28; pt-PT;)',
                'X-Requested-With': 'XMLHttpRequest',
            }, null);

            const response = payload;
            return response;
        
        }catch(e:any){

            console.log(e);

            return { message: 'Não foi possível fazer login no DETRAN PE', error: e.message };
        }

    }

}

export const pe = new Pe();
