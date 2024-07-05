import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { TESTNETS } from "..";
import NetworkBox from "./NetworkBox";
import DeleteIcon from "@mui/icons-material/Delete";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import {
  formatAddress,
  previousWallets,
  removePreviousWallet,
} from "../utils/WalletUtils";
import type { SIWESession } from "@web3modal/siwe";

interface WalletPopoverProps {
  open: boolean;
  anchorEl: HTMLDivElement | null;
  onClose: () => void;
  currentChain?: number;
  address: string;
  handleDisconnect: () => void;
}

const WalletPopover: React.FC<WalletPopoverProps> = ({
  open,
  anchorEl,
  onClose,
  currentChain,
  address,
  handleDisconnect,
}) => {
  const [tooltipTitle, setTooltipTitle] = useState(address || "");

  const handleAddressClick = (address: string) => {
    navigator.clipboard.writeText(address || "");
    setTooltipTitle("Copied!");

    setTimeout(() => {
      setTooltipTitle(address || "");
    }, 1000);
  };

  const [wallets, setWallets] = useState<SIWESession[]>([]);

  useEffect(() => {
    setWallets(previousWallets(address));
  }, [address]);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      sx={{
        boxShadow: "2px 2px 12px 0px #D6DAE7",
        ".MuiPaper-root": {
          borderRadius: 4,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: " #F4F5F9",
          m: 2,
          borderRadius: 4,
          p: 2,
          gap: 1,
        }}
      >
        <Tooltip title={tooltipTitle} arrow>
          <Typography
            fontWeight={600}
            sx={{ mb: 1, cursor: "pointer" }}
            onClick={() => handleAddressClick(address as string)}
          >
            {formatAddress(address)}
          </Typography>
        </Tooltip>
        {TESTNETS.map((chain) => (
          <NetworkBox
            key={chain.chainId}
            rpcUrl={chain.rpcUrl}
            explorerUrl={chain.explorerUrl}
            currency={chain.currency}
            name={chain.name}
            chainId={chain.chainId}
            currentChain={currentChain}
            closePopover={onClose}
          />
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography fontSize={12} fontWeight={700}>
          Other wallets:
        </Typography>
      </Box>
      <List dense>
        {wallets.map((wallet, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{
              "&:hover .delete-icon": {
                visibility: "visible",
              },
            }}
          >
            <ListItemButton sx={{ ml: 2, mr: 2, borderRadius: 2 }}>
              <Typography fontSize={14} sx={{ flexGrow: 1 }}>
                {formatAddress(wallet.address)}
              </Typography>
              <IconButton
                edge="end"
                aria-label="delete"
                className="delete-icon"
                sx={{ visibility: "hidden" }}
                onClick={() => {
                  removePreviousWallet(wallet.address);
                  setWallets(previousWallets(address));
                }}
              >
                <DeleteIcon fontSize={"small"} />
              </IconButton>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 1 }}>
        <Button
          sx={{ textTransform: "none", borderRadius: 5 }}
          variant="contained"
          onClick={handleDisconnect}
          size="small"
          startIcon={<PowerSettingsNewIcon />}
        >
          Disconnect
        </Button>
      </Box>
    </Popover>
  );
};

export default WalletPopover;
