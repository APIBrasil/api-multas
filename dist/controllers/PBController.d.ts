declare class PB {
    index: (req: any, res: any) => Promise<any>;
    scrap: (placa: string, renavam: string) => Promise<{
        error: any;
        resultado?: undefined;
    } | {
        resultado: {
            multas: any;
            dados: ({
                nome: any;
                documento: any;
                nosso_numero: any;
                pagamento?: undefined;
            } | {
                pagamento: any;
                nome?: undefined;
                documento?: undefined;
                nosso_numero?: undefined;
            })[];
            placa: string;
            renavam: string;
        };
        error?: undefined;
    }>;
}
export declare const pb: PB;
export {};
