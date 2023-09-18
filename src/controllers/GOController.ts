import utils from 'src/utils/utils';
import validation from '../validations/validation';

class Go {

    index = async (req: any, res: any) => {

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
            const bearerToken:any = await utils.request(`${process.env.GO_URL}/token`, 'POST', {
                'Origin': 'https://www.go.gov.br', 
                'Referer': 'https://www.go.gov.br/', 
                'Content-Type': 'application/x-www-form-urlencoded', 
            }, {
                'grant_type': 'client_credentials',
                'client_id': 'Uxw0W7lCNcM6fsewGxvDChLcEAEa',
                'client_secret': 'JPU7TYzkDzafwmfgG2POSrUsbgEa' 
            });

            const token = bearerToken.access_token;
            const consultarVeiculoPorPlacaRenavam = await this.consultaVeiculoPorPlacaRenavam(placa, renavam, token);

            return consultarVeiculoPorPlacaRenavam;
            
        }catch(e){
            return { message: 'Não foi possível fazer login no DETRAN GO' };
        }

    }

    consultaVeiculoPorPlacaRenavam = async (placa: string, renavam: string, token: string) => {
        
        const sessionString = '{"sistema":"SSEDI","codgChave":"EKH1A40","codgTipoChave":"03","idServico":13679,"idSessao":"","ip":"179.221.165.221"}';
        const sessionBase64 = Buffer.from(sessionString).toString('base64');

        try{

            const payload = await utils.request(`${process.env.GO_URL}/detran/financeiro/1.0.0/sedi/financeiro/consultarVeiculoPorPlacaRenavam?placa=${placa}&renavam=${renavam}`, 'GET', {
                'Origin': 'https://www.go.gov.br',
                'Referer': 'https://www.go.gov.br/',
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
                "Session": sessionBase64
            }, null);

            const debitos = payload;

            return { placa, renavam, debitos }

        }catch(e){
            return { message: 'Não foi possível consultar o veículo' };
        }
    
    
    }
    

}

export const go = new Go();