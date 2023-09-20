import { Request, Response } from 'express';
declare class Ma {
    index: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    scrap: (placa: string, renavam: string) => Promise<{
        message: any;
        veiculo?: undefined;
        placa?: undefined;
        renavam?: undefined;
        autuacoes?: undefined;
        infracoes?: undefined;
    } | {
        veiculo: {
            idVeiculo: any;
            idAcesso: any;
            documentoProprietario: any;
            chassi: any;
        };
        placa: string;
        renavam: string;
        autuacoes: {
            numeroAuto: string;
            descricao: string;
            localComplemento: string;
            valor: number;
        }[];
        infracoes: {
            numeroAuto: string;
            descricao: string;
            localComplemento: string;
            valor: number;
        }[];
        message?: undefined;
    }>;
}
export declare const ma: Ma;
export {};
