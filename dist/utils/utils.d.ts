declare class Utils {
    newPage: () => Promise<import("puppeteer").Page>;
    convertStringToDecimal: (value: string) => number;
    removeAccents(str: string): string;
}
declare const _default: Utils;
export default _default;
