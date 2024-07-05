import { Box, Typography } from "@mui/material";
import React from "react";
import type { Chain } from "@web3modal/scaffold-utils/ethers";
import { useSwitchNetwork } from "@web3modal/ethers/react";

interface NetworkBoxProps extends Chain {
  currentChain?: number;
  closePopover: () => void;
}

const NetworkBox: React.FC<NetworkBoxProps> = ({
  rpcUrl,
  explorerUrl,
  currency,
  name,
  chainId,
  currentChain,
  closePopover,
}) => {
  const { switchNetwork } = useSwitchNetwork();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirction: "row",
        gap: 2,
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={() => {
        switchNetwork(chainId);
        closePopover();
      }}
    >
      <img
        src={name + ".png"}
        alt={name + "icon"}
        style={{ height: "24px", width: "22px" }}
      />
      <Typography
        fontSize={14}
        fontWeight={currentChain === chainId ? 700 : 400}
      >
        {name}
      </Typography>
    </Box>
  );
};

export default NetworkBox;
