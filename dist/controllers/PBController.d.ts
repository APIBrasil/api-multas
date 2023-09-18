import { Request, Response } from 'express';
declare class PB {
    index: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
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
