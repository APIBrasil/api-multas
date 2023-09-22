declare class Utils {
    sleep: (ms: number) => Promise<unknown>;
    clearString: (value: string) => string;
    convertStringToDecimal: (value: string) => number;
    removeAccents(str: string): string;
    webhook: (url: string, method?: string, header?: any, body?: any) => Promise<void>;
    request: (url: string, method: string, headers: any, body: any) => Promise<any>;
}
declare const _default: Utils;
export default _default;
