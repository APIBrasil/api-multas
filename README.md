# 💵 API de Multas Brasil 
A ideia desse repositório é centralizar e obter dados de Multas de todos os Detrans, através da técnica de Web Scraping e retornar os dados das multas em JSON

## Status do Scrap
Você pode acompanhar o status de cada scrap no link abaixo

<a href="https://status.apibrasil.com.br/status/whatsapp"> https://status.apibrasil.com.br </a>

## Consumindo com Javascript
```bash
yarn add api-multas
```

```ts
import ApiMultas from 'api-multas'

(async () => {

    const host = 'http://localhost:2222';
    const token = '1234567890';

    const api = new ApiMultas();

    const request = await api.multas('mg', host, token, {
        placa: 'ABC1234',
        renavam: '123456789'
    });

    console.log(request);

})();
```

Oservações para o estado de PI, que por ter captcha é necessário obter uma chave do <a href="2captcha.com" target="_blank" > 2captcha </a>

```ts
import ApiMultas from 'api-multas'

(async () => {

    const host = 'http://localhost:2222';
    const token = '1234567890';

    const api = new ApiMultas();

    //use o webhook.site para visualizar o retorno
    const request = await api.multas('mg', host, token, {
        placa: "ABC1234",
        renavam: "0000000000",
        twocaptchaapikey: "abc1234abc1234abc1234abc1234",
        webhook: "https://webhook.site/3545dc20-14ff-4c74-bee0-755762fd834a"
    });

    console.log(request);

})();
```

Link do pacote
<a href="https://www.npmjs.com/package/api-multas" target="_blank"> https://www.npmjs.com/package/api-multas </a>

## Estados suportados
Ainda não suportamos todos os estados, em breve  iremos adicionar mais estados, se quiser sugerir um estado, abra uma PR

|    DETRANS    |   SITUAÇÃO        |   DISPONIBILIDADE    |    OBSERVAÇÕES              |
|---------------|-------------------|----------------------|------------------------------
|    Detran MG	|	DISPONÍVEL      |    Operacional       |                             |
|    Detran AL	|	DISPONÍVEL      |    Operacional       |                             |   
|    Detran PB	|	DISPONÍVEL      |    Operacional       |                             |
|    Detran GO	|	DISPONÍVEL      |    Operacional       |                             |
|    Detran MA	|   DISPONÍVEL      |    Operacional       |                             |
|    Detran DF	|   DISPONÍVEL      |    Operacional       |                             |
|    Detran MS	|	DISPONÍVEL      |    Operacional       |                             |
|    Detran PE	|   DISPONÍVEL      |    Operacional       |                             |
|    Detran SE	|   DISPONÍVEL      |    Operacional       |                             |
|    Detran PR	|   DISPONÍVEL      |    Operacional       |                             |
|    Detran PI	|   DISPONÍVEL      |    Operacional       | Nacessário informar webhook |
|    Detran AC	|Em desenvolvimento |                      |                             |
|    Detran AM	|Em desenvolvimento |                      |                             |
|    Detran BA	|Em desenvolvimento |                      |                             |
|    Detran CE	|Em desenvolvimento |                      |                             |
|    Detran ES	|Em desenvolvimento |                      |                             |
|    Detran MT	|Em desenvolvimento |                      |                             |
|    Detran PA	|Em desenvolvimento |                      |                             |
|    Detran RJ	|Em desenvolvimento |                      |                             |
|    Detran RN	|Em desenvolvimento |                      |                             |
|    Detran RO	|Em desenvolvimento |                      |                             |
|    Detran RR	|Em desenvolvimento |                      |                             |
|    Detran RS	|Em desenvolvimento |                      |                             |
|    Detran SC	|Em desenvolvimento |                      |                             |
|    Detran SP	|Em desenvolvimento |                      |                             |
|    Detran TO  |Em desenvolvimento |                      |                             |

## Dependencias (Linux)
```bash
apt update -y && apt upgrade -y && apt install git curl -y 
```

## Instalando Node 18 (Linux)
```bash
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash  && source ~/.profile  && nvm install 18 && nvm use 18
```

## Instalando Yarn (Linux)
```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list && sudo apt update -y && sudo apt install yarn -y && yarn global add pm2
```

## Instalando Node e Yarn (Windows)
Você irá precisar do Node 18+ para utilizar essa API

#### Dowload Yarn
https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable

#### Download Node
https://nodejs.org/pt-br/download

## Instalação API (Linux)
```bash 
cd /opt/
```

```bash
git clone https://github.com/APIBrasil/api-multas.git && cd /api-multas
```

```bash
cp .env-exemplo .env && yarn && yarn start
```

## Rodando em Background
```bash
yarn add pm2 --global
```

```bash
pm2 start dist/index.js --name=API-MULTAS
```

## Exemplos de requests e respostas
```
[POST] https://localhost:2222/multas/mg
```
```
[POST] https://localhost:2222/multas/al
```
## Payloads de request padrão 
O payload pode variar de acordo com o estado.
```json
{ 
    "placa":"ABC1234",
    "renavam":"00000000000"
}
```

## Response da request padrão
O response pode variar de acordo com o estado.
```json
{
    "placa": "ABC1234",
    "renavam": "00000000000",
    "multas": [
        {
            "sequencia": "1",
            "processo": "00000000",
            "descricao": "TRANSITAR EM VELOCIDADE SUPERIOR A MAXIMA PERMITIDA EM ATE 2",
            "local": "AV. RISOLETA NEVES  A 138M DA RUA RAIMUNDA FERREIR",
            "valor": 152.11
        },
        {
            "sequencia": "2",
            "processo": "00000000",
            "descricao": "DIRIGIR VEICULO SEGURANDO TELEFONE CELULAR",
            "local": "AVE AFONSO SILVA ESQUINA RUA ESPIRITO DE LUZ",
            "valor": 299.54
        }
    ]
}
```

## Observações importantes
⚠️ Essa API é apenas parte de um estudo pessoal, use em produção por sua conta e risco, lembre-se essa API se basea em técnicas de web scrap para obter os dados em transformar em JSON, se o DETRAN do seu estado alterar algo nos avise para que possamos corrgir. 

## License

MIT © [APIBrasil](http://jhowbhz.com)
