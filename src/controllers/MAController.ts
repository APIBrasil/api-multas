import utils from 'src/utils/utils';
import validation from '../validations/validation';
import puppeteer from "puppeteer";

import FormData from 'form-data';

import { Request, Response } from 'express';


class Ma {

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

        let data = new FormData();

        data.append('placa', placa);
        data.append('renavam', renavam);

        const payload = await utils.request(`${process.env.MA_URL}`, 'POST', {
            'Accept-Encoding': 'gzip',
            'User-Agent': 'okhttp/3.12.12',
            'Accept': 'application/json'
        }, data)

        if(payload.includes('alert alert-danger')){
            let contentFromHtml = payload.split('<div class="alert alert-danger alert-dismissible show" role="alert">')[1];
            contentFromHtml = contentFromHtml.split('\r\n')[1].trim();

            return { message: contentFromHtml };
        }

        // payload contein 
        //  <input type="hidden" name="idAcesso" id="idAcesso" value="19353678" />
        // [1]             <input type="hidden" name="placa" id="placa" value="OTL4C21" />
        // [1]             <input type="hidden" name="renavam" id="renavam" value="513200223" />
        // [1]             <input type="hidden" name="chassi" id="chassi" value="9C2JC4830DR018207" />
        // [1]             <input type="hidden" name="idVeiculo" id="idVeiculo" value="1319444" />
        // [1]             <input type="hidden" name="documentoProprietario" id="documentoProprietario" value="80895654768">

        const idAcesso = payload.split('<input type="hidden" name="idAcesso" id="idAcesso" value="')[1].split('"')[0];
        const idVeiculo = payload.split('<input type="hidden" name="idVeiculo" id="idVeiculo" value="')[1].split('"')[0];
        const documentoProprietario = payload.split('<input type="hidden" name="documentoProprietario" id="documentoProprietario" value="')[1].split('"')[0];
        const chassi = payload.split('<input type="hidden" name="chassi" id="chassi" value="')[1].split('"')[0];
        
        // payload contein 
        // <table class="table table-striped table-sm table-bordered table-hover">
        //     <tbody><tr>
        //         <td>
        //             <div class="text-muted">Placa</div>
        //             OTL4C21
        //         </td>
        //         <td>
        //             <div class="text-muted">Renavam</div>
        //             513200223
        //         </td>
        //         <td>
        //             <div class="text-muted">Placa Anterior</div>
        //             OTL4C21/PA
        //         </td>
        //         <td>
        //             <div class="text-muted ">Tipo</div>
        //             3 - MOTONETA            
        //         </td>
        //         <td colspan="2">
        //             <div class="text-muted ">Carroceria</div>
        //             999 - NAO APLICAVEL/NENHUMA         
        //         </td>
        //         <td>
        //             <div class="text-muted ">Espécie</div>
        //             1 - PASSAGEIRO
        //         </td>
        //     </tr>
        //     <tr>
        //         <td colspan="7">
        //             <div class="text-muted">Nome do proprietário</div>
        //             ANTONIO CARLOS GERA                          
        //         </td>
        //     </tr>
        //     <tr>
        //         <td colspan="2">
        //             <div class="text-muted">Marca/Modelo</div>
        //             2009 - HONDA/BIZ 125 EX              
        //         </td>
        //         <td>
        //             <div class="text-muted">Cor</div>
        //             4 - BRANCA    
        //         </td>
        //         <td>
        //             <div class="text-muted">Categoria</div>
        //             1 - PARTICULAR
        //         </td>
        //         <td>
        //             <div class="text-muted">Lugares</div>
        //             2
        //         </td>
        //         <td>
        //             <div class="text-muted">Potência</div>
                    
        //         </td>
        //         <td>
        //             <div class="text-muted">Combustível</div>
        //             16 - ALCOOL/GASOLINA               
        //         </td>
        //     </tr>
        //     <tr>
        //         <td colspan="4">
        //             <div class="text-muted">Licenciado até</div>
        //             2023 em 17/05/2023, Licenciamento Anual (CRLV emitido por DETRAN\ServicosDetran)(Via 1)
        //         </td>
        //             <td class="text-center" colspan="2">
        //                 <font style="color: #015f85; font-weight: bold;">CRLV ELETRONICO 2023</font> <br> <img src="/imagens/impressora.png" style="cursor:pointer !important;" onclick="ConsultaCRLVe();">
        //             </td>
        //         <td>
        //             <div class="text-muted">Adquirido em</div>
        //             08/02/2021
        //         </td>
        //     </tr>
        //     <tr>
        //         <td colspan="7">
        //             <div class="text-muted">Informação da financeira via SNG - Sistema Nacional de Gravame</div>
        //             Nenhuma informação pendente até esta data
        //         </td>
        //     </tr>
        //     <tr>
        //         <td colspan="7" class="">
        //             <div class="text-muted">Impedimentos</div>
        //             Nenhum impedimento registrado até esta data
        //         </td>
        //     </tr>
        //     <tr>
        //         <td colspan="7">
        //             <div class="text-muted">Informações Adicionais</div>
        //             Nenhuma informação adicional até esta data
        //         </td>
        //     </tr>
        // </tbody></table>

        //payload corpo_2049 contein table 

        // const contentFromDivCorpo2049 = $('table')

        const multas = [] as any[];

        return { multas: multas, placa: placa, renavam: renavam };

    }
}

export const ma = new Ma();