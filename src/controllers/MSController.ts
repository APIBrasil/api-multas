import utils from 'src/utils/utils';
import validation from '../validations/validation';
import { Request, Response } from 'express';

class Ms {

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
        
        const headers: any = {
            'Host': 'web.detran.ms.gov.br',
            'Origin': 'https://www.meudetran.ms.gov.br',
            'Referer': 'https://www.meudetran.ms.gov.br/veiculo_filtro_cnt/',
            'Dtn-Auth-Token': '9851B392-41DF-8060-C3A2-81240E3AEBD6',
            'Content-Type': 'text/plain',
        }
          
        let data: string = `AEANPA10                                                                                            ${placa}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         1${renavam}`;
        
        const request: any = await utils.request(`${process.env.MS_URL}`, 'POST', headers, data);
        const dataResponse: any = {};
        
        const response = await request;
        
        // RENAAM INFORMADO NAO PERTENCE
        if (response.indexOf('RENAVAM INFORMADO NAO PERTENCE') !== -1) {
            return { error: `O renavam ${renavam} não pertence à placa ${placa}` };
        }
        
        // NAO CADASTRADO NA BASE
        if (response.indexOf('NAO CADASTRADO NA BASE') !== -1) {
            return { error: `O veículo ${placa} não está cadastrado na base MS` };
        }
        
        // Dividir o texto em partes
        const parts = response.split(/\s+/);


        // Explorar "00000023477EXISTEM" autuações em dataResponse
        const splitedForAutuacoes = response.indexOf('AUTUACOES') !== -1 ? response.split('AUTUACOES')[0].split(/\s+/) : false;

        console.log(splitedForAutuacoes);

        if (splitedForAutuacoes) {
            dataResponse['autuacoes'] = splitedForAutuacoes[5];
        }
        const coresVeiculosBrasil = [
            "BRANCO",
            "BRANCA",
            "PRETO",
            "PRETA",
            "PRATA",
            "CINZA",
            "VERMELHO",
            "AZUL",
            "VERDE",
            "AMARELO",
            "MARROM",
            "BEGE",
            "DOURADO",
            "LARANJA",
            "ROSA",
            "ROXO",
            "VINHO",
            "FANTASIA",
            "OUTRA",
            "OUTRO",
            "NAO INFORMADA"
          ];
          
        // Procurar cores em parts
        const matches = parts.filter((item:string) => {
            return coresVeiculosBrasil.includes(item.toUpperCase());
        });
        
        console.log(matches);
          
        if (matches.length > 0) {
            dataResponse['cor'] = matches[0];
        }
        // IPVA
        const splitedForIpva = response.indexOf('IPVA') !== -1 ? response.split('IPVA')[1].split(/\s+/) : false;

        if (splitedForIpva) {
            dataResponse['ipva'] = splitedForIpva[1];
        }

        //"NAO HA DEBITOS PARA ESTE VEICULO"
        if (response.indexOf('NAO HA DEBITOS PARA ESTE VEICULO') !== -1) {
            return { error: `Não há débitos para o veículo ${placa}` };
        }

        // LIC.:
        const splitedForLic = response.indexOf('LIC.:') !== -1 ? response.split('LIC.:')[1].split(/\s+/) : false;

        if (splitedForLic) {
            dataResponse['licenciamento'] = splitedForLic[0];
        }

        // Partes contêm a string "MULTAS"
        const splitedForNumber = response.indexOf('MULTAS') !== -1 ? response.split('MULTAS')[1].split(/\s+/) : false;

        if (splitedForNumber) {

            const multas = splitedForNumber.filter((item: any) => {
                // Transforme a string em número decimal com 2 casas decimais
                item = parseFloat(item).toFixed(2);
                return item > 0;
            });

            //filter multas com valores diferentes
            const multasValues = splitedForNumber.filter((item: any) => {
                // Transforme a string em número decimal com 2 casas decimais
                item = parseFloat(item).toFixed(2);
                return item > 0;
            }
            ).filter((item: any, index: any, self: any) => {
                return index === self.indexOf(item);
            }

            );

            dataResponse['valores'] = multasValues.map((item: any) => utils.convertStringToDecimal(item));
        }


        return dataResponse;

    }

}

export const ms = new Ms();