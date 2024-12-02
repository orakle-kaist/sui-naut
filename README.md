# Sui-Naut

## How to start

### 1. Run localnet network

```
RUST_LOG="off,sui_node=info" sui start --with-faucet --force-regenesis
```

### 2. Acquire Gas from Faucet

```
curl --location --request POST 'http://127.0.0.1:9123/gas' \
--header 'Content-Type: application/json' \
--data-raw '{
    "FixedAmountRequest": {
        "recipient": "<YOUR_ADDRESS>"
    }
}'

```

### 3. Build and Deploy Sui contracts

```
cd sui_contracts
sui move build
sui client publish --skip-dependency-verification
```

### 4. Client

```
cd sui_client
yarn install; yarn dev
```
