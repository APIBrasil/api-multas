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

        const idVeiculo = payload.split('<input type="hidden" name="idVeiculo" id="idVeiculo" value="')[1].split('"')[0];
        const idAcesso = payload.split('<input type="hidden" name="idAcesso" id="idAcesso" value="')[1].split('"')[0];
        const documentoProprietario = payload.split('<input type="hidden" name="documentoProprietario" id="documentoProprietario" value="')[1].split('"')[0];
        const chassi = payload.split('<input type="hidden" name="chassi" id="chassi" value="')[1].split('"')[0];

        //https://portal.detrannet.detran.ma.gov.br/Veiculo/Extrato/MultasVeiculo.cshtml
        const urlInfracoes = "https://portal.detrannet.detran.ma.gov.br/Veiculo/Extrato/MultasVeiculo.cshtml";
    
        let formInfracoes = new FormData();
        formInfracoes.append('idVeiculo', idVeiculo);

        //form data with idVeiculo post
        const requestInfracoes = await utils.request(urlInfracoes, 'POST', {...data.getHeaders()}, formInfracoes)
        const tableBody = requestInfracoes.split('<tbody>')[1].split('</tbody>')[0].split('<tr>');

        const infracoes = [];
        
        for (let i = 1; i < tableBody.length; i++) {

            //remove html tags special characters spaces and line breaks
            const tableRow = tableBody[i].split('</td>');

            const numeroAuto = utils.clearString(tableRow[0].split('<td>')[1])
            const descricao = utils.clearString(tableRow[1].split('<td>')[1])
            const localComplemento = utils.clearString(tableRow[2].split('<td>')[1])
            const valor = utils.convertStringToDecimal(utils.clearString(tableRow[3].split('<td>')[1]))

            //Em Aberto
            infracoes.push({
                numeroAuto,
                descricao,
                localComplemento,
                valor,
            });
        }
        
        let formAutuacoes = new FormData();
        formAutuacoes.append('idVeiculo', idVeiculo);

        const urlAutuacoes = "https://portal.detrannet.detran.ma.gov.br/Veiculo/Extrato/AutuacoesVeiculo.cshtml";
        const requestAutuacoes = await utils.request(urlAutuacoes, 'POST', {...data.getHeaders()}, formAutuacoes)

        const tableBodyAutuacoes = requestAutuacoes.split('<tbody>')[1].split('</tbody>')[0].split('<tr>');

        const autuacoes = [];

        for (let i = 1; i < tableBodyAutuacoes.length; i++) {

            //remove html tags special characters spaces and line breaks
            const tableRow = tableBodyAutuacoes[i].split('</td>');

            const numeroAuto = utils.clearString(tableRow[0].split('<td>')[1])
            const descricao = utils.clearString(tableRow[1].split('<td>')[1])
            const localComplemento = utils.clearString(tableRow[2].split('<td>')[1])
            const valor = utils.convertStringToDecimal(utils.clearString(tableRow[3].split('<td>')[1]))

            //Em Aberto
            autuacoes.push({
                numeroAuto,
                descricao,
                localComplemento,
                valor,
            });

        }

        return {
            veiculo :{
                idVeiculo,
                idAcesso,
                documentoProprietario,
                chassi,
            },
            placa, 
            renavam,
            autuacoes,
            infracoes
        };

    }
    
}

export const ma = new Ma();