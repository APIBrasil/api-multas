import puppeteer from 'puppeteer';
import axios from 'axios';
class Utils {

    clearString = (value: string) => {
        const stringClear = value.replace(/(<([^>]+)>)/gi, "").replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ").trim();
        return stringClear;
    }

    convertStringToDecimal = (value: string) => {
        return Number(value.replace('R$', '').replace('.', '').replace(',', '.').replace('R$ ', ''));
    }
    
    removeAccents(str: string) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    request = async (url: string, method: string, headers: any, body: any) => {
            
        const response = await axios.request({
            url,
            method,
            headers,
            data: body
        });

        return response.data;

    }


}

export default new Utils()