import { Request, Response } from 'express';
declare class Ma {
    index: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    scrap: (placa: string, renavam: string) => Promise<{
        message: any;
        placa?: undefined;
        renavam?: undefined;
    } | {
        placa: string;
        renavam: string;
        message?: undefined;
    }>;
}
export declare const ma: Ma;
export {};
