import axios from 'axios';

const buscaMultas = async ( placa, renavam ) => {

    const body = JSON.stringify({
        "placa": `${placa}`, // Exemplo: `AAA0000`
        "renavam": `${renavam}` // Exemplo: `00000000000`	
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:2222/multas/mg',
        headers: {
            'token': '1234567890',
            'Content-Type': 'application/json'
        },
        data: body
    };

    const payload = axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });

    return payload;

}

buscaMultas('AAA0000', '00000000000');