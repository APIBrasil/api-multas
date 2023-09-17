"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    constructor() {
        this.convertStringToDecimal = (value) => {
            return Number(value.replace('R$ ', '').replace('.', '').replace(',', '.'));
        };
    }
    removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
}
exports.default = new Utils();
