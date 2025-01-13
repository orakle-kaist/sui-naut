import { useEffect, useState } from "react";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { challengeConfig } from "../config/challengeConfig";

type UserHasFlag = { [packageId: string]: boolean };

export function useValidateFlag() {
  const currentAccount = useCurrentAccount();

  const [userHasFlag, setUserHasFlag] = useState<UserHasFlag>();

  const { data, refetch } = useSuiClientQuery<"getOwnedObjects">(
    "getOwnedObjects",
    {
      owner: currentAccount?.address || "",
      options: {
        showType: true,
        showOwner: true,
        showPreviousTransaction: true,
        showDisplay: false,
        showContent: false,
        showBcs: false,
        showStorageRebate: false,
      },
    },
    {
      gcTime: 1,
    },
  );

  useEffect(() => {
    if (!data?.data) return;

    const newUserHasFlag: UserHasFlag = {};
    for (const packageId of challengeConfig.map(({ packageId }) => packageId)) {
      if (!packageId) continue;
      data.data.forEach((object) => {
        const type = object.data?.type;
        if (
          type &&
          type.toLowerCase().startsWith(packageId.toLowerCase()) &&
          type.endsWith("::SuinautFlag")
        ) {
          newUserHasFlag[packageId] = true;
        }
      });
    }
    setUserHasFlag(newUserHasFlag);
  }, [data?.data]);

  return { userHasFlag, updateUserHasFlag: refetch };
}
