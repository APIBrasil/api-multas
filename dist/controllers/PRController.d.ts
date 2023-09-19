import { Request, Response } from 'express';
declare class Pr {
    index: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    scrap: (renavam: string) => Promise<any>;
}
export declare const pr: Pr;
export {};
