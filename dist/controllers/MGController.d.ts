import { Request, Response } from 'express';
declare class Mg {
    index: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    scrap: (placa: string, renavam: string) => Promise<{
        placa: string;
        renavam: string;
        message: string;
        multas?: undefined;
    } | {
        placa: string;
        renavam: string;
        multas: any[];
        message?: undefined;
    }>;
}
export declare const mg: Mg;
export {};
