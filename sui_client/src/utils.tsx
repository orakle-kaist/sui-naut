import { bcs, fromBase64, toHex } from '@mysten/bcs';

// const UID = bcs.bytes(32).transform({
//   input: (val: string) => fromBase64(val), // Base64 -> Uint8Array
//   output: (val: Uint8Array) => toHex(val), // Uint8Array -> Hex string
// });
//

// const UID = bcs.string();
const UID = bcs.fixedArray(66, bcs.string());


// Step 2: Owner enum 수정
const Owner = bcs.enum('owner', {
  AddressOwner: UID, // AddressOwner는 UID 타입으로 정의
});

// Step 3: ObjectRef 구조 정의
const ObjectRef = bcs.struct('objectRef', {
  objectId: UID,
  version: bcs.u64(),
  digest: bcs.string(),
});

// Step 4: TransactionEffects 구조 정의
const GasCostSummary = bcs.struct('gasCostSummary', {
  computationCost: bcs.u64(),
  storageCost: bcs.u64(),
  storageRebate: bcs.u64(),
  nonRefundableStorageFee: bcs.u64(),
});

const TransactionEffects = bcs.struct('transactionEffects', {
  messageVersion: bcs.string(),
  status: bcs.struct('executionStatus', {
    status: bcs.string(),
  }),
  executedEpoch: bcs.u64(),
  gasUsed: GasCostSummary,
  modifiedAtVersions: bcs.vector(
    bcs.struct('modifiedAtVersion', {
      objectId: UID,
      sequenceNumber: bcs.u64(),
    }),
  ),
  transactionDigest: bcs.string(),
  created: bcs.vector(
    bcs.struct('created', {
      owner: Owner,
      reference: ObjectRef,
    }),
  ),
  mutated: bcs.vector(
    bcs.struct('mutated', {
      owner: Owner,
      reference: ObjectRef,
    }),
  ),
  gasObject: bcs.struct('gasObject', {
    owner: Owner,
    reference: ObjectRef,
  }),
  dependencies: bcs.vector(bcs.string()),
});

// Step 5: Base64 파싱 함수 작성
export function parseTransactionEffects(base64Effects: string) {
  try {
    // Base64 디코딩
    const decodedBytes = fromBase64(base64Effects);

    console.log(decodedBytes)

    // BCS 디시리얼라이징
    const effects = TransactionEffects.parse(decodedBytes);

    // 결과 반환
    return effects;
  } catch (error) {
    console.error('Failed to parse TransactionEffects:', error);
    return null;
  }
}
