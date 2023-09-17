declare class PB {
    index: (req: any, res: any) => Promise<any>;
    scrap: (placa: string, renavam: string) => Promise<{
        error: any;
        resultado?: undefined;
    } | {
        resultado: {
            multas: any;
            dados: {
                nome: any;
                documento: any;
                nosso_numero: any;
                codigo_barras: any;
                renavam: any;
                data_vencimento: any;
                data_emissao: any;
                valor: number;
            }[];
            placa: string;
            renavam: string;
        };
        error?: undefined;
    }>;
}
export declare const pb: PB;
export {};
