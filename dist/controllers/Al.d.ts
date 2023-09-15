declare class Al {
    scrap: (placa: string, renavam: string) => Promise<{
        message: string;
    }>;
    convertStringToDecimal: (value: string) => number;
}
export declare const al: Al;
export {};
