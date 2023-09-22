import axios from 'axios';
class Utils {

    imageFileToBase64 = async (image: any) => {
        const file = await image.screenshot({ encoding: "base64" });
        return file;
    }

    sleep = (ms: number) => {
        console.log(`Sleeping for ${ms}ms`);
        return new Promise(resolve => setTimeout(resolve, ms));
    }

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

    webhook = async (url: string, method?: string, header?: any, body?: any) => {

        this.request(url, method ? method : 'POST', header ? header : {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Detran-PI Scraper'
        }, body ? body : {});

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