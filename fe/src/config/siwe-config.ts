import type {
  SIWECreateMessageArgs,
  SIWESession,
  SIWEVerifyMessageArgs,
} from "@web3modal/siwe";
import {
  formatMessage,
  getAddressFromMessage,
  getChainIdFromMessage,
  createSIWEConfig,
} from "@web3modal/siwe";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

async function getMessageParams() {
  return {
    domain: window.location.host,
    uri: window.location.origin,
    chains: [11155111, 80002],
    statement: "Please sign with your account",
  };
}

async function getSession(): Promise<SIWESession | null> {
  try {
    const response = await fetch(`${API_URL}/api/session`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      console.log("Failed to get SIWESession");
      throw new Error("Failed to get SIWESession");
    }
    const data = await response.json();
    console.log("got address and chainId", data);
    var savedWallets: SIWESession[] = JSON.parse(
      localStorage.getItem("SAVED_WALLETS") || "[]",
    );

    // Check if the wallet address is already saved
    const walletExists = savedWallets.some(
      (wallet) => wallet.address === data.address,
    );

    if (!walletExists) {
      savedWallets.push(data);
      localStorage.setItem("SAVED_WALLETS", JSON.stringify(savedWallets));
    }
    return data;
  } catch (error) {
    return null;
  }
}

async function verifyMessage({ message, signature }: SIWEVerifyMessageArgs) {
  try {
    console.log("verifying signature");

    const chainId = getChainIdFromMessage(message);
    const address = getAddressFromMessage(message);

    const response = await fetch(`${API_URL}/api/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        signature: signature,
        chainId: chainId,
        address: address,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    const { success } = data;
    return success;
  } catch (error) {
    console.error("Error verifying signature:", error);
    throw new Error("Failed to get verify session!");
  }
}

async function getNonce() {
  try {
    const response = await fetch(`${API_URL}/api/nonce`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get JWT token!");
    }
    const data = await response.json();
    const { nonce } = data;
    return nonce;
  } catch (error) {
    console.error("Error getting nonce:", error);
    throw new Error("Failed to get nonce!");
  }
}

async function signOut() {
  try {
    console.log("signed out");
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error("Failed to sign out!");
  }
}

export async function onSignOut() {
  console.log("what");
  try {
    const response = await fetch(`${API_URL}/api/session`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      console.log("I could not sign out");
      throw new Error("Failed to destroy session!");
    }
    console.log("I signed out");
  } catch (error) {
    console.error("Error clearing session:", error);
    throw new Error("Failed to destroy session!");
  }
}

export const siweConfig = createSIWEConfig({
  getMessageParams,
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
    formatMessage(args, address),
  getNonce,
  verifyMessage,
  getSession,
  signOut,
  onSignOut,
  onSignIn: () => {
    console.log("i signed in");
  },
});
