declare class Mg {
    scrap: (placa: string, renavam: string) => Promise<{
        placa: string;
        renavam: string;
        multas: any[];
    }>;
    convertStringToDecimal: (value: string) => number;
}
export declare const mg: Mg;
export {};
