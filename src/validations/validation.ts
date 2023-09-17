class validation {

    public generic(placa: string, renavam: string) {

        placa = placa.replace(/[^a-zA-Z0-9]/g, '');
        renavam = renavam.replace(/[^0-9]/g, '');

        if (typeof placa != 'string' || typeof renavam != 'string') {
            return {
                message: 'Validation error',
                errors: 'Placa and Renavam are required'
            }
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

        if (erros.length > 0) {
            return {
                message: 'Validation error',
                errors: erros
            }
        }

        return null;

    }

}

export default new validation();