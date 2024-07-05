import { useState } from "react";
import {
  useDisconnect,
  useWeb3Modal,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { onSignOut } from "./config/siwe-config";

import { Box, Button, Typography } from "@mui/material";

import { TESTNETS } from ".";
import WalletPopover from "./components/WalletPopover";
import { formatAddress } from "./utils/WalletUtils";

function App() {
  const modal = useWeb3Modal();
  const { isConnected, address, chainId } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpenPopover = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {
    modal.open();
  };

  const handleDisconnect = async () => {
    handleClosePopover();
    await disconnect();
    await onSignOut();
  };

  return (
    <div>
      {!isConnected ? (
        <Button
          sx={{ textTransform: "none", borderRadius: 5 }}
          onClick={handleClick}
          variant="contained"
        >
          Connect Wallet
        </Button>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "130px",
            borderRadius: 2,
            alignItems: "center",
            cursor: "pointer",
            backgroundColor: " #F4F5F9",
            padding: 1,
          }}
          onClick={handleOpenPopover}
        >
          <img
            src={
              chainId
                ? TESTNETS.find((chain) => chain.chainId === chainId)?.name +
                  ".png"
                : undefined
            }
            alt="chain icon"
            style={{ height: "24px", width: "24px" }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              ml: 1,
            }}
          >
            <Typography
              fontWeight={700}
              fontSize={12}
              sx={{ lineHeight: "15px" }}
            >
              {chainId &&
                TESTNETS.find((chain) => chain.chainId === chainId)?.name}
            </Typography>
            <Typography
              fontWeight={700}
              fontSize={11}
              sx={{ opacity: 0.5, lineHeight: "11px" }}
            >
              {formatAddress(address)}
            </Typography>
          </Box>
        </Box>
      )}
      <WalletPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        currentChain={chainId}
        address={address as string}
        handleDisconnect={handleDisconnect}
      />
    </div>
  );
}

export default App;
