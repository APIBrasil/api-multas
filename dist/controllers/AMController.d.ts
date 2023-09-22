import { Request, Response } from 'express';
declare class Am {
    index: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    scrap: (placa: string, renavam: string) => Promise<{
        placa: string;
        renavam: string;
        data: any;
        error?: undefined;
    } | {
        placa: string;
        renavam: string;
        error: any;
        data?: undefined;
    }>;
}
export declare const am: Am;
export {};
