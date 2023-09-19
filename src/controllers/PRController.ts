import utils from 'src/utils/utils';
import validation from '../validations/validation';

import { Request, Response } from 'express';

class Pr {

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

            const payload = await utils.request(`${process.env.PR_URL}/${renavam}`, 'GET', {
                'Accept-Charset': 'UTF-8',
                'Accept-Encoding': 'gzip',
                'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description, Origin, X-Requested-With, Accept',
                'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Origin': '*',
                // 'Authorization': '681752:pCZKSPPKgkdFidfr6nJ4ADBYUCc=',
                'Connection': 'Keep-Alive',
                'Host': 'www.wsutils.detran.pr.gov.br',
                'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 9; SM-G973N Build/PQ3A.190605.05171606)',
                'Version': '1.1.5',
                'X-Date': `${new Date().toISOString()}`
            }, null);

            const response = payload;
            return response;
        
        }catch(e:any){
            return { message: 'Não foi possível fazer login no DETRAN PR', error: e.message };
        }

    }

}

export const pr = new Pr();
