declare class Go {
    index: (req: any, res: any) => Promise<any>;
    scrap: (placa: string, renavam: string) => Promise<{
        placa: string;
        renavam: string;
        debitos: any;
        message?: undefined;
    } | {
        message: string;
        placa?: undefined;
        renavam?: undefined;
        debitos?: undefined;
    }>;
    consultaVeiculoPorPlacaRenavam: (placa: string, renavam: string, token: string) => Promise<{
        placa: string;
        renavam: string;
        debitos: any;
        message?: undefined;
    } | {
        message: string;
        placa?: undefined;
        renavam?: undefined;
        debitos?: undefined;
    }>;
}
export declare const go: Go;
export {};
