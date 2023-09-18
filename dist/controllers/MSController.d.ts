declare class Ms {
    index: (req: any, res: any) => Promise<any>;
    scrap: (placa: string, renavam: string) => Promise<{
        error: string;
        response?: undefined;
        responseClear?: undefined;
        dataResponse?: undefined;
        respnseFormated?: undefined;
        multas?: undefined;
    } | {
        response: any;
        responseClear: any;
        dataResponse: any;
        respnseFormated: any;
        multas: any;
        error?: undefined;
    }>;
}
export declare const ms: Ms;
export {};
