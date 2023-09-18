import utils from 'src/utils/utils';
import validation from '../validations/validation';

class Ms {

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

        // var i, x, n;
        // var uri;
        // var post_data;
        // var target_id;
        // var charset_html = document.inputEncoding.toLowerCase();
        // var charset_esp = [
        //         "utf-8",
        //         "windows-1250",
        //         "windows-1253",
        //         "windows-1254",
        //         "windows-1255",
        //         "windows-1256",
        //         "windows-1257",
        //         "iso-8859-2",
        //         "iso-8859-4",
        //         "iso-8859-6",
        //         "iso-8859-7",
        //         "iso-8859-8",
        //         "iso-8859-8-i",
        //         "iso-8859-9",
        //         "iso-8859-13",
        //         "euc-kr"
        // ];
        
        const headers:any = { 
                'Host': 'web.detran.ms.gov.br', 
                'Origin': 'https://www.meudetran.ms.gov.br', 
                'Referer': 'https://www.meudetran.ms.gov.br/veiculo_filtro_cnt/', 
                'Dtn-Auth-Token': '9851B392-41DF-8060-C3A2-81240E3AEBD6', 
                'Content-Type': 'text/plain',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
        }

        let data:string = `AEANPA10                                                                                            ${placa}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         1${renavam}`;

        const request:any = await utils.request(`${process.env.MS_URL}`, 'POST', headers, data);

        // const response = await request;


        //response replace +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        const response = await request;
        const responseClear = await request.replace(/(\+)/g, ' ').replace(/(\n)/g, ' ').replace(/(\t)/g, ' ').replace(/(\r)/g, ' ').replace(/(\s{2,})/g, ' ').trim();
        console.log(response);


        const dataResponse = [] as any;

        //RENAVAM INFORMADO NAO PERTENCE
        if (response.indexOf('RENAVAM INFORMADO NAO PERTENCE') !== -1) {
            return { error: `O renavam ${renavam} não pertence a placa ${placa}` };
        }

        //NAO CADASTRADO NA BASE
        if (response.indexOf('NAO CADASTRADO NA BASE') !== -1) {
            return { error: `O veículo ${placa} não está cadastrado na base MS` };
        }

        response.split(' ').forEach((item: any) => {
            if (item !== '') {
                dataResponse.push(item);
            }
        });

        //responseFormated split coma spaces and break lines permitir acentos e caracteres especiais, pontuação e virgula
        // const respnseFormated = response.split(/[\s,]+/).filter(Boolean);
        // const respnseFormated = response.split(/[\s,]+/).join(' ').replace(/[^a-zA-Z0-9À-ú\s]/g, '');
        // const respnseFormated = response.split(/[\s,]+/).join(' ').replace(/[^a-zA-Z0-9À-ú\s]/g, '').trim();
        const respnseFormated = response
        .split(/[\s,]+/)
        .join(' ')
        .replace(/[^a-zA-Z0-9À-ú\s,.]/g, '') // Adicionamos , e . na classe de caracteres
        .trim();

        const regexPattern = /(\d+,\d{2})/g;
        const multas = response.match(regexPattern);

        console.log(respnseFormated);

        return {response, responseClear, dataResponse, respnseFormated, multas}

    }

}

export const ms = new Ms();