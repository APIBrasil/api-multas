class validation {

    public validate(placa: string, renavam: string) {

        console.log(typeof placa == 'undefined');

        let erros = [];

        if (placa != 'string' || renavam != 'string') {
            erros.push('Placa and Renavam are required');
            return {
                message: 'validation error',
                errors: erros
            }
        }

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

        console.log(placa, renavam, erros);

        return {
            message: 'validation error',
            errors: erros
        }

    }

}

export default new validation();