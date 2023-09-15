declare class Mg {
    index: (req: any, res: any) => Promise<any>;
    scrap: (placa: string, renavam: string) => Promise<{
        placa: string;
        renavam: string;
        multas: never[];
        message: string;
    } | {
        placa: string;
        renavam: string;
        multas: any[];
        message?: undefined;
    }>;
    convertStringToDecimal: (value: string) => number;
}
export declare const mg: Mg;
export {};
