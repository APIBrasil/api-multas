declare class validation {
    generic(placa: string, renavam: string): {
        message: string;
        errors: string;
    } | {
        message: string;
        errors: string[];
    } | null;
}
declare const _default: validation;
export default _default;
