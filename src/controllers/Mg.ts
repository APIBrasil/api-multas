import puppeteer from "puppeteer";

class Mg {

    scrap = async (placa: string, renavam: string) => {

        const browser = await puppeteer.launch({
            headless: 'new',
            slowMo: 0,
            timeout: 5000,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
            ]
        });
        
        const page = await browser.newPage();

        await page.goto('https://www.detran.mg.gov.br/veiculos/situacao-do-veiculo/emitir-de-extrato-de-multas');

        const placaSelector = '#placa';
        const renavamSelector = '#renavam';
        const linkPadraoSelector = '.link-padrao';
        const buttonsSelector = 'button[type="submit"]';
        const tableSelector = 'table > tbody > tr';

        const inputPlaca = await page.$(placaSelector);
        const inputRenavam = await page.$(renavamSelector);

        renavam = renavam.replace(/[^0-9]/g, '');
        placa = placa.replace(/[^a-zA-Z0-9]/g, '');

        await inputPlaca?.type(placa);
        await inputRenavam?.type(renavam);

        const buttons = await page.$$(buttonsSelector);
        const buttonSubmit = buttons[1];

        await buttonSubmit?.click();

        try {
            
            await page.waitForSelector(linkPadraoSelector, { timeout: 5000 });

        } catch (error) {
            await browser.close();
            return { placa, renavam, multas: [] };
        }

        const linkPadrao = await page.$(linkPadraoSelector);

        await linkPadrao?.click();

        await page.waitForSelector(tableSelector);
        const trs = await page.$$(tableSelector);

        const multas = [] as any[];

        await Promise.all(trs.map(async (tr) => {

            const tds = await tr.$$('td');

            const content = await Promise.all(tds.map(async (td) => {
                const text = await page.evaluate((el) => el.textContent, td);
                return text;
            }));

            //[0] = Sequência
            //[1] = Processo
            //[2] = Descricao
            //[3] = Local
            //[4] = Valor

            multas.push({
                sequencia: content[0],
                processo: content[1],
                descricao: content[2],
                local: content[3],
                valor: this.convertStringToDecimal(content[4]),
            });

            return content;

        }));

        await browser.close();

        return { placa, renavam, multas };
    }

    convertStringToDecimal = (value: string) => {
        return Number(value.replace('R$ ', '').replace('.', '').replace(',', '.'));
    }
}

export const mg = new Mg();