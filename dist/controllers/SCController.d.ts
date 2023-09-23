import { Request, Response } from 'express';
declare class SCController {
    index: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    scrap: (placa: string, renavam: string, twocaptchaapikey: string) => Promise<{
        placa: string;
        renavam: string;
        multas: never[];
        message: string;
        error?: undefined;
    } | {
        placa: string;
        renavam: string;
        multas: any;
        message?: undefined;
        error?: undefined;
    } | {
        placa: string;
        renavam: string;
        multas: never[];
        error: any;
        message?: undefined;
    }>;
}
export declare const sc: SCController;
export {};
