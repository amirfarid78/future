import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Copy, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/hooks/use-wallet";
import { formatAddress } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";

export function WalletButton() {
  const { address, isConnected, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const { toast } = useToast();

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  const viewOnExplorer = () => {
    // For localhost, just show message
    toast({
      title: "Local Network",
      description: "Running on localhost - no block explorer available",
    });
  };

  if (!isConnected) {
    return (
      <Button
        onClick={connectWallet}
        disabled={isConnecting}
        className="hover-elevate group"
        data-testid="button-connect-wallet"
      >
        <Wallet className="h-4 w-4 mr-2" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="glass hover-elevate" data-testid="button-wallet-dropdown">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="font-mono" data-testid="text-wallet-address">
              {formatAddress(address)}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass">
        <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress} data-testid="button-copy-address">
          <Copy className="h-4 w-4 mr-2" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={viewOnExplorer} data-testid="button-view-explorer">
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={disconnectWallet}
          className="text-destructive"
          data-testid="button-disconnect"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
