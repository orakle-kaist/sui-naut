1. Change the address of Suinaut to the address of deployed package. [Location](https://github.com/orakle-kaist/sui-naut/blob/c2b8a8dc5c532053facd5216f391be88073c8176/sui_contracts/Move.toml#L11)
```toml
[addresses]
Suinaut = 0x...
MoveStdlib = "0x2"
```

2. When deployed Suinaut package, object of type FlashLender is created. Find the object id and alias
```bash
export LENDER=0x...
```

3. cd to this directory and follow below steps
```
sui client publish . --gas-budget 100000000 --skip-dependency-verification
export SOLUTION_ADDRESS=0x...
```

4. Call the solution contract
```
sui client call --json --gas-budget 1000000000 --package $SOLUTION_ADDRESS --module sol --function main --args $LENDER
```

5. From the output, check if the flag is true
```json
  "events": [
    {
      "id": {
        "txDigest": "EpkSCuSWBMcMvY2D29pNeWZWSnkTeARKzzA2RCZ4YZKu",
        "eventSeq": "0"
      },
      "packageId": "0xd618a97ce4aed3b2fb19297ae31ef5e80ad804daa55d34ac138bd0ff70ebc749",
      "transactionModule": "sol",
      "sender": "0x265b5d89addc5839601ff486b3ab98abbda0f1360d1469e1143414c1e2fd7483",
      "type": "0xf255c5cddf1812b88ab2b071dd09d0327ba0da8d8c2a76cc5b1f43d92168c9f7::flash::Flag",
      "parsedJson": {
        "flag": true,
        "user": "0x265b5d89addc5839601ff486b3ab98abbda0f1360d1469e1143414c1e2fd7483"
      },
      "bcs": "CPsgukznYr1U18PUHuH52kAVPgMLo2Tx5A2j4tp4MWVUC"
    }
  ],
```
or submit the solution package id(`0xd6...` above) and module name(`sol` above) into the frontend page
