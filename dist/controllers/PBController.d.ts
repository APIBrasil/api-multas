declare class PB {
    index: (req: any, res: any) => Promise<any>;
    scrap: (placa: string, renavam: string) => Promise<{
        error: any;
        placa?: undefined;
        renavam?: undefined;
        multas?: undefined;
        dados?: undefined;
    } | {
        placa: string;
        renavam: string;
        multas: any[];
        dados: any[];
        error?: undefined;
    }>;
}
export declare const pb: PB;
export {};
