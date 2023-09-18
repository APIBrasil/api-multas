import { Request, Response } from 'express';
declare class Pe {
    index: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    scrap: (placa: string) => Promise<any>;
}
export declare const pe: Pe;
export {};
