# Sui-Naut

[![Netlify Status](https://api.netlify.com/api/v1/badges/6476d282-a45a-481c-820e-d962ccb23274/deploy-status)](https://app.netlify.com/sites/suinaut/deploys)

## How to start

### 1. Run localnet network

```shell
RUST_LOG="off,sui_node=info" sui start --with-faucet --force-regenesis
```

### 2. Acquire Gas from Faucet

```shell
curl --location --request POST 'http://127.0.0.1:9123/gas' \
--header 'Content-Type: application/json' \
--data-raw '{
    "FixedAmountRequest": {
        "recipient": "<YOUR_ADDRESS>"
    }
}'

```

### 3. Build and Deploy Sui contracts

```shell
cd sui_contracts/01_Counter
sui move build
sui client publish --skip-dependency-verification
```

### 4. Client

```shell
cd sui_client
yarn install; yarn dev
```
