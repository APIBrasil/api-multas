"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class validation {
    validate(placa, renavam) {
        if (placa != 'string' || renavam != 'string') {
            return {
                message: 'Validation error',
                errors: 'Placa and Renavam are required'
            };
        }
        let erros = [];
        if (!placa) {
            erros.push('Placa is required');
        }
        if (!renavam) {
            erros.push('Renavam is required');
        }
        if (placa.length < 6 || placa.length > 7) {
            erros.push('Placa is not valid');
        }
        if (renavam.length < 9 || renavam.length > 11) {
            erros.push('Renavam is not valid');
        }
        return {
            message: 'Validation error',
            errors: erros
        };
    }
}
exports.default = new validation();
