import utils from '../utils/utils';
import { Request, Response } from 'express';
class Se {

    index = async (req: Request, res: Response) => {

        const renavam = req.body.renavam as string;
        
        if(!renavam.match(/^[0-9]+$/)){
            return res.status(400).json({ message: 'Renavam inválido' });
        }
        
        const multas = await this.scrap(renavam);
    
        res.status(200).json(multas);
        
    } 
    
    scrap = async (renavam: string) => {

        try{

            const payload = await utils.request(`${process.env.SE_URL}/${renavam}/0`, 'GET', {
                'Accept-Encoding': 'gzip',
                'Host': 'www.detran.se.gov.br', 
                'User-Agent': 'okhttp/3.12.12', 
                'Accept': 'application/json'
            }, null);

            const debitos = payload;
            return debitos;
        
        }catch(e:any){
            return { message: 'Não foi possível fazer login no DETRAN SE', error: e.message };
        }

    }

}

export const se = new Se();
