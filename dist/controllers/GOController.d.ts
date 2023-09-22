import { Request, Response } from 'express';
declare class Go {
    index: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    scrap: (placa: string, renavam: string) => Promise<{
        placa: string;
        renavam: string;
        debitos: any;
        message?: undefined;
        error?: undefined;
    } | {
        message: string;
        error: any;
        placa?: undefined;
        renavam?: undefined;
        debitos?: undefined;
    } | {
        message: string;
    }>;
    consultaVeiculoPorPlacaRenavam: (placa: string, renavam: string, token: string) => Promise<{
        placa: string;
        renavam: string;
        debitos: any;
        message?: undefined;
        error?: undefined;
    } | {
        message: string;
        error: any;
        placa?: undefined;
        renavam?: undefined;
        debitos?: undefined;
    }>;
}
export declare const go: Go;
export {};
