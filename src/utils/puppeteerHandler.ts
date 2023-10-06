import puppeteer, { Browser, Page, ElementHandle } from 'puppeteer';

/**
 * An abstract class to handle common Puppeteer operations.
 */
export abstract class PuppeteerHandler {
    private browser: Browser | null = null;
    private page: Page | null = null;

    /**
     * Opens a new Puppeteer browser instance.
     */
    protected async openBrowser() {
        this.browser = await puppeteer.launch({
            headless: process.env.NODE_ENV === 'production' ? 'new' : false,
            slowMo: process.env.NODE_ENV === 'production' ? 0 : 50,
            timeout: 10000,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
            ],
        });
    }

    /**
     * Opens a new page in the current browser instance and navigates to the specified URL.
     * @param {string} url - The URL to navigate to.
     */
    protected async openPage(url: string) {
        if (!this.browser) {
            throw new Error('Browser is not open');
        }

        this.page = await this.browser.newPage();
        await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
    }

    /**
     * Closes the Puppeteer browser instance.
     */
    protected async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    /**
     * Closes the current page in the browser.
     */
    protected async closePage() {
        if (this.page) {
            await this.page.close();
            this.page = null;
        }
    }

    /**
     * Waits for an element matching the given selector to appear in the current page.
     * @param {string} selector - The selector to wait for.
     */
    protected async waitForSelector(selector: string) {
        if (!this.page) {
            throw new Error('Page is not open');
        }

        await this.page.waitForSelector(selector);
    }

    /**
     * Clicks on an element with the specified selector.
     * @param {string} selector - The selector of the element to click.
     */
    protected async click(selector: string) {
        if (!this.page) {
            throw new Error('Page is not open');
        }

        await this.page.click(selector);
    }

    /**
     * Gets an element with the specified selector.
     * @param {string} selector - The selector of the element to get.
     * @returns {Promise<ElementHandle<any> | null>} - A Promise that resolves with the ElementHandle or null if not found.
     */
    protected async getElement(selector: string): Promise<ElementHandle<any> | null> {
        if (!this.page) {
            throw new Error('Page is not open');
        }

        return this.page.$(selector);
    }

    /**
     * Gets all elements matching the specified selector.
     * @param {string} selector - The selector of the elements to get.
     * @returns {Promise<ElementHandle<any>[]>} - A Promise that resolves with an array of ElementHandles.
     */
    protected async getElements(selector: string): Promise<ElementHandle<any>[]> {
        if (!this.page) {
            throw new Error('Page is not open');
        }

        return this.page.$$(selector);
    }

    /**
     * Types the specified text into an element with the given selector.
     * @param {string} selector - The selector of the input element.
     * @param {string} text - The text to type.
     */
    protected async type(selector: string, text: string) {
        const element = await this.getElement(selector);
        if (element) {
            await element.type(text);
        }
    }
}
