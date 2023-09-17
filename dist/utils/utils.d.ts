declare class Utils {
    convertStringToDecimal: (value: string) => number;
    removeAccents(str: string): string;
    request: (url: string, method: string, headers: any, body: any) => Promise<any>;
}
declare const _default: Utils;
export default _default;
