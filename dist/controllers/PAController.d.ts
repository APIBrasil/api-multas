import { Request, Response } from 'express';
declare class Pa {
    index: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    scrap: (placa: string, renavam: string, twocaptchaapikey: string, webhook: string) => Promise<void>;
}
export declare const pa: Pa;
export {};
