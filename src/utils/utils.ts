import puppeteer from 'puppeteer';
import axios from 'axios';
class Utils {

    convertStringToDecimal = (value: string) => {
        return Number(value.replace('R$ ', '').replace('.', '').replace(',', '.'));
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