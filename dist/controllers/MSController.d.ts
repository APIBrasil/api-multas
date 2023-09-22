import { Request, Response } from 'express';
declare class Ms {
    index: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    scrap: (placa: string, renavam: string) => Promise<any>;
}
export declare const ms: Ms;
export {};
