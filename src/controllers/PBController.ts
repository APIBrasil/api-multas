import puppeteer from 'puppeteer';
import validation from '../validations/validation';
import utils from 'src/utils/utils';

class PB {

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

        const browser = await puppeteer.launch({
            headless: process.env.NODE_ENV === 'production' ? 'new' : false,
            slowMo: process.env.NODE_ENV === 'production' ? 0 : 50,
            timeout: 5000,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
            ]
        });

        const page = await browser.newPage();

        const tablesMultas = 'table[width="648"]';
        const tablesDados = 'table[width="650"]';
        const tablesPagamento = 'table[width="647"]';

        await page.goto(`${process.env.PB_URL}/BBDT_MULTABOLETO_CLIENTE/MultaBoleto?placa=${placa}&renavam=${renavam}&opcao=I&display=web&redirect=ok`);

        const tds = await page.$$eval('td[width="28%"]', tds => tds.map(td => td.innerText));

        if(tds[1].includes('Erro:')) {
            const error = tds[1].split('Erro: ')[1].split(' [ Voltar ]')[0] as string;
            return {error: error.replace(/(\r\n|\n|\r)/gm, "").replace('[ Voltar ]', '')};
        }

        const tableMultas = await page.$$(tablesMultas).then((tables) => {
            return tables;
        });

        const tableDados = await page.$$(tablesDados).then((tables) => {
            return tables;
        });

        const tablePagamento = await page.$$(tablesPagamento).then((tables) => {
            return tables;
        });

        if (tds[1].includes('Erro:')) {
            const error = tds[1].split('Erro: ')[1].split(' [ Voltar ]')[0].replace(/(\r\n|\n|\r)/gm, "").replace('[ Voltar ]', '');
            return { error };
        }

        const linha1 = await tableDados[1].$$eval('tr', trs => trs.map(tr => tr.innerText));
        const condutor = linha1[0].split('\n');

        const linha2 = await tableMultas[0].$$eval('tr', trs => trs.map(tr => tr.innerText));
        const multas = linha2[0].split('\n');

        const dadosPagamento = await tableDados[2].$$eval('tr', trs => trs.map(tr => tr.innerText));
        const pagamento = dadosPagamento[0].split('\n');

        // const linha3 = await tablePagamento[0].$$eval('tr', trs => trs.map(tr => tr.innerText)); 
        const linha4 = await tablePagamento[1].$$eval('tr', trs => trs.map(tr => tr.innerText)); 

        console.log(linha4);

        const codigoBarras = linha4[0].split('\n')[0];

        const object_multa = [] as any;

        for (let i = 0; i < multas.length; i++) {

            const element = multas[i].split('\t');
            const orgao = element[0];
            const valor = element[2];

            if (typeof valor === 'string') {
                const valor_decimal: number = Number(valor.replace(/[^0-9,]/g, '').replace(',', '.'));
                object_multa.push({ orgao: orgao, valor: valor_decimal });
            }

        }

        const dados = {
            "multas": object_multa,
            "dados": [
                {
                    "nome": condutor[1].trim(),
                    "documento": condutor[4].trim(),
                    "nosso_numero": condutor[9].trim(),
                    "codigo_barras": codigoBarras.trim(),
                    // "placa": pagamento[1].split('\t')[0].trim(),
                    // "chassi": pagamento[2].split('\t')[0].trim(),
                    "renavam": pagamento[3].split('\t')[0].trim(),
                    "data_vencimento": pagamento[4].split('\t')[0].trim(),
                    "data_emissao": pagamento[5].split('\t')[0].trim(),
                    "valor": utils.convertStringToDecimal(pagamento[8].split('\t')[0].trim())
                }
            ]
        };

        const resultado = {
            "placa": placa,
            "renavam": renavam,
            ...dados
        };

        await browser.close();

        return { resultado };
        
    };

}

export const pb = new PB();