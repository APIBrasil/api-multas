import { Request, Response } from 'express';
declare class To {
    index: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    scrap: (placa: string, renavam: string) => Promise<{
        placa: string;
        renavam: string;
    }>;
}
export declare const to: To;
export {};
