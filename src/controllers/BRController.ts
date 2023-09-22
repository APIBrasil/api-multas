import utils from '../utils/utils';
import validation from '../validations/validation';

import { Request, Response } from 'express';

class Br {

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

            const payload = await utils.request(`https://api.detran.df.gov.br/app/vinculo-veiculo/area-publica/buscaVeiculo/${placa}/${renavam}?user_key=${process.env.BR_KEY}`, 'GET', {
                'Connection': 'Keep-Alive',
                'Accept': 'application/json, text/plain, */*',
                'Host': 'api.detran.df.gov.br',
                'User-Agent': 'okhttp/4.9.2',
                'Content-Type': 'application/json',
                'X-Application-Context': 'application:prod:8080',
                'X-OneAgent-JS-Injection': true,
                'X-XSS-Protection': '1; mode=block',
            }, null);

            const debitos = payload;
            return debitos;
        
        }catch(e:any){
            return { message: 'Não foi possível fazer login no DETRAN BR', error: e.message };
        }

    }

}

export const br = new Br();
