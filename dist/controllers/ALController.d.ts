declare class Al {
    index: (req: any, res: any) => Promise<any>;
    scrap: (placa: string, renavam: string) => Promise<{
        placa: string;
        renavam: string;
        multas: never[];
        message: any;
    } | {
        multas: any;
        placa: string;
        renavam: string;
        message: string;
    }>;
    checkErros: (browser: any, page: any, placa: string, renavam: string) => Promise<false | {
        placa: string;
        renavam: string;
        multas: never[];
        message: any;
    }>;
    removeAccents(str: string): string;
    convertStringToDecimal: (value: string) => number;
}
export declare const al: Al;
export {};
