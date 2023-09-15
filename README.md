# API Multas Brasil 
### A ideia desse repositório é obter dados de Multas de todos os Detrans, através de Web Scrap e retornar os dados das multas em JSON

# Estados suportados
Ainda não suportamos todos os estados, em breve  iremos adicionar mais estados, se quiser sugerir um estado, abra uma PR

| Estados  | Situação |
| ------------- | ------------- |
| MG  | Beta disponível  |
| SP  | Não disponível  |
| SC  | Não disponível  |
| RJ  | Não disponível  |

# Dependencias
```bash
apt update -y && apt upgrade -y && apt install git -y 
```

```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list && sudo apt update -y && sudo apt install yarn -y && yarn global add pm2
```

# Instalação
```bash 
cd /opt/
```

```bash
git clone https://github.com/APIBrasil/api-multas.git && cd /api-multas
```

```bash
cp .env-exemplo .env && yarn start
```

# Exemplos de requests e respostas
### Endpoint [POST]

https://localhost:2222/multas/mg

### Payload
```json
{ 
    "placa":"ABC1234",
    "renavam":"00000000000"
}
```

### Response
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
# Preview postman
![image](https://github.com/APIBrasil/api-multas/assets/31408451/88be72e5-84f7-43b5-8e2f-cbf49bfea860)

