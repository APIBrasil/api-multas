declare class Utils {
    imageCaptcha: (page: any, input: string, output: string, submit: string) => Promise<any>;
    imageFileToBase64: (image: any) => Promise<any>;
    sleep: (ms: number) => Promise<unknown>;
    clearString: (value: string) => string;
    convertStringToDecimal: (value: string) => number;
    removeAccents(str: string): string;
    webhook: (url: string, method?: string, header?: any, body?: any) => Promise<void>;
    request: (url: string, method: string, headers: any, body: any) => Promise<any>;
}
declare const _default: Utils;
export default _default;
