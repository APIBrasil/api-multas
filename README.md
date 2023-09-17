# 💵 API de Multas Brasil 
### A ideia desse repositório é obter dados de Multas de todos os Detrans, através de Web Scrap e retornar os dados das multas em JSON

# Estados suportados
Ainda não suportamos todos os estados, em breve  iremos adicionar mais estados, se quiser sugerir um estado, abra uma PR

| Estados      | Status             | Situação             |
| -------------| ------------------ | ---------------------|
| MG           | Disponível         |     Operacional      |
| AL           | Disponível         |     Operacional      |
| PB           | Disponível         |     Operacional      |
| SP           | Não disponível     | Não é possivel ainda |
| SC           | Não disponível     | Em desenvolvimento   |
| RJ           | Não disponível     | Não é possivel ainda |

# Dependencias (Linux)
```bash
apt update -y && apt upgrade -y && apt install git curl -y 
```

# Nvm e Yarn
```bash
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash  && source ~/.profile  && nvm install 18 && nvm use 18

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
cp .env-exemplo .env && yarn && yarn start
```

# Exemplos de requests e respostas
### Endpoint

```
[POST] https://localhost:2222/multas/mg
```
```
[POST] https://localhost:2222/multas/al
```
### Payload
O payload é padrão para todos os estados.
```json
{ 
    "placa":"ABC1234",
    "renavam":"00000000000"
}
```

### Response
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
