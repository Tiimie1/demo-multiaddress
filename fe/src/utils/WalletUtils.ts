import { SIWESession } from "@web3modal/siwe";

export const formatAddress = (
  address: `0x${string}` | undefined | string,
): string => {
  return address
    ? `${address?.substring(0, 6)}...${address?.substring(address?.length - 4)}`
    : "";
};

export const previousWallets = (address: string) => {
  var savedWallets: SIWESession[] = JSON.parse(
    localStorage.getItem("SAVED_WALLETS") || "[]",
  );

  var filteredWallets = savedWallets.filter(
    (wallet) => wallet.address !== address,
  );

  return filteredWallets;
};

export const removePreviousWallet = (address: string) => {
  var savedWallets: SIWESession[] = JSON.parse(
    localStorage.getItem("SAVED_WALLETS") || "[]",
  );

  var filteredWallets = savedWallets.filter(
    (wallet) => wallet.address !== address,
  );

  localStorage.setItem("SAVED_WALLETS", JSON.stringify(filteredWallets));
};
