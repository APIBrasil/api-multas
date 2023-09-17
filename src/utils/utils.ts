import puppeteer from 'puppeteer';

class Utils {

    convertStringToDecimal = (value: string) => {
        return Number(value.replace('R$ ', '').replace('.', '').replace(',', '.'));
    }
    
    removeAccents(str: string) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

}

export default new Utils()