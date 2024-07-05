import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { siweConfig } from "./config/siwe-config";
import type { Chain } from "@web3modal/scaffold-utils/ethers";

const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID as string;

export const TESTNETS: Chain[] = [
  {
    chainId: 11155111,
    name: "Sepolia",
    currency: "ETH",
    explorerUrl: "https://sepolia.otterscan.io",
    rpcUrl: "https://rpc.sepolia.org",
  },
  {
    chainId: 80002,
    name: "Amoy",
    currency: "MATIC",
    explorerUrl: "https://amoy.polygonscan.com/",
    rpcUrl: "https://rpc-amoy.polygon.technology",
  },
];

const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "http://localhost:3000",
  icons: ["https://avatars.mywebsite.com/"],
};

const ethersConfig = defaultConfig({
  metadata,
});

createWeb3Modal({
  ethersConfig,
  chains: TESTNETS,
  projectId,
  siweConfig: siweConfig,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
