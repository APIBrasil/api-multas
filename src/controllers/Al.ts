import puppeteer from "puppeteer";

class Al {

    scrap = async (placa: string, renavam: string) => {

        const browser = await puppeteer.launch({
            headless: 'new',
            slowMo: 50,
            timeout: 5000,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
            ]
        });
        
        const page = await browser.newPage();

        await page.goto('https://www.detran.al.gov.br/veiculos/guia_infracoes/');

        const placaSelector = '#id_placa';
        const renavamSelector = '#id_renavam';

        // const linkPadraoSelector = '.link-padrao';
        const buttonsSelector = 'button[type="submit"]';

        const inputPlaca = await page.$(placaSelector);
        const inputRenavam = await page.$(renavamSelector);

        renavam = renavam.replace(/[^0-9]/g, '');
        placa = placa.replace(/[^a-zA-Z0-9]/g, '');

        await inputPlaca?.type(placa);
        await inputRenavam?.type(renavam);

        const buttons = await page.$$(buttonsSelector);
        const buttonSubmit = buttons[1];

        await buttonSubmit?.click();

        await browser.close();

        return { message: 'Scraping is not implemented yet' };
    }

    convertStringToDecimal = (value: string) => {
        return Number(value.replace('R$ ', '').replace('.', '').replace(',', '.'));
    }
}

export const al = new Al();