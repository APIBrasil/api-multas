import axios from 'axios';

class Utils {
    /**
     * Converts an image file to base64 encoding.
     * @param {any} image - The image to convert.
     * @returns {Promise<string>} - The base64-encoded image.
     */
    async imageFileToBase64(image) {
        const file = await image.screenshot({ encoding: "base64" });
        return file;
    }

    /**
     * Sleeps for a specified number of milliseconds.
     * @param {number} ms - The number of milliseconds to sleep.
     * @returns {Promise<void>} - A Promise that resolves after sleeping.
     */
    sleep(ms) {
        console.log(`Sleeping for ${ms}ms`);
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Clears unwanted characters and whitespace from a string.
     * @param {string} value - The input string to clear.
     * @returns {string} - The cleaned string.
     */
    clearString(value) {
        const stringClear = value.replace(/(<([^>]+)>)/gi, "").replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ").trim();
        return stringClear;
    }

    /**
     * Converts a formatted currency string to a decimal number.
     * @param {string} value - The currency string to convert.
     * @returns {number} - The decimal representation of the currency.
     */
    convertStringToDecimal(value) {
        return Number(value.replace('R$', '').replace('.', '').replace(',', '.').replace('R$ ', ''));
    }

    /**
     * Removes diacritics (accents) from a string.
     * @param {string} str - The input string with diacritics.
     * @returns {string} - The string with diacritics removed.
     */
    removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    /**
     * Sends an HTTP request using Axios.
     * @param {string} url - The URL to send the request to.
     * @param {string} [method='POST'] - The HTTP method (default is POST).
     * @param {object} [header] - The request headers.
     * @param {object} [body] - The request body.
     * @returns {Promise<any>} - A Promise that resolves with the response data.
     */
    async request(url, method = 'POST', header = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Detran-PI Scraper'
    }, body = {}) {
        const response = await axios.request({
            url,
            method,
            headers,
            data: body
        });

        return response.data;
    }

    /**
     * Sends an HTTP request to a specified URL using the provided method, headers, and body.
     * @param {string} url - The URL to send the request to.
     * @param {string} [method] - The HTTP method (default is POST).
     * @param {object} [header] - The request headers.
     * @param {object} [body] - The request body.
     * @returns {Promise<void>}
     */
    async webhook(url, method, header, body) {
        this.request(url, method || 'POST', header || {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Detran-PI Scraper'
        }, body || {});
    }
}

export default new Utils();
