import axios from 'axios';
import * as Captcha from '2captcha';
class Utils {

    imageCaptcha = async (page:any, input:string, output:string, submit:string) => {

        const solver = new Captcha.Solver(process.env.TWOCAPTCHA_KEY as string);
        const captchaBase64 = await this.imageFileToBase64(await page.$(input));
        const buttonSubmit = await page.$(submit)

        const captchaSolver = await solver.imageCaptcha({
            body: captchaBase64,
            numeric: 4,
            min_len: 0,
            max_len: 5,
        } as any)
        .then(async (response: any) => {
                
            const inputCaptcha = await page.$(output);
            await inputCaptcha?.type(response.data);

            await buttonSubmit?.click();

            return response.data;
        })
        .catch((error: any) => {

            console.log(error);
            return false;

        });

        return captchaSolver;

    }

    imageFileToBase64 = async (image: any) => {

        const base64 = await image.screenshot({
            encoding: 'base64',
        });

        return base64;
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