import { Request, Response } from 'express';
declare class Al {
    index: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    scrap: (placa: string, renavam: string) => Promise<{
        placa: string;
        renavam: string;
        multas: never[];
        message: any;
    } | {
        multas: any;
        placa: string;
        renavam: string;
        message: string;
    }>;
    checkErros: (browser: any, page: any, placa: string, renavam: string) => Promise<false | {
        placa: string;
        renavam: string;
        multas: never[];
        message: any;
    }>;
}
export declare const al: Al;
export {};
