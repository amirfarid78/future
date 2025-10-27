import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { useContract } from "@/hooks/use-contract";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "rewards" | "referral";
  availableAmount: number;
  onSuccess?: () => void;
}

export function WithdrawModal({ open, onOpenChange, type, availableAmount, onSuccess }: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [step, setStep] = useState<"input" | "confirming" | "success">("input");
  
  const { address } = useWallet();
  const { claimRewards, withdrawReferral, isLoading: isWithdrawing } = useContract(address);

  const numAmount = parseFloat(amount) || 0;
  const isValid = numAmount >= 5 && numAmount <= availableAmount;
  const minWithdraw = 5;

  const handleWithdraw = async () => {
    if (!isValid || !address) return;

    setStep("confirming");

    try {
      let receipt;
      if (type === "rewards") {
        receipt = await claimRewards();
      } else {
        receipt = await withdrawReferral();
      }
      
      setTxHash(receipt.hash);
      setStep("success");
      
      // Call onSuccess callback to refetch data
      onSuccess?.();

      // Reset after 3 seconds
      setTimeout(() => {
        setStep("input");
        setAmount("");
        setTxHash("");
        onOpenChange(false);
      }, 3000);
    } catch (error) {
      console.error("Withdrawal failed:", error);
      setStep("input");
    }
  };

  const setMaxAmount = () => {
    setAmount(availableAmount.toString());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-primary/20 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "rewards" ? (
              <>
                <TrendingUp className="h-5 w-5 text-success" />
                Claim Rewards
              </>
            ) : (
              <>
                <Users className="h-5 w-5 text-chart-2" />
                Withdraw Referral
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {type === "rewards"
              ? "Withdraw your accumulated staking rewards"
              : "Withdraw your referral commission earnings"}
          </DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Available Balance</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={setMaxAmount}
                  className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                  data-testid="button-max-amount"
                >
                  MAX
                </Button>
              </div>
              <p className="text-2xl font-bold gradient-text from-success to-primary">
                ${availableAmount.toFixed(2)} USDT
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Withdrawal Amount (USDT)</Label>
              <div className="relative">
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder={`Min ${minWithdraw} USDT`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-16 text-lg font-semibold"
                  min={minWithdraw}
                  max={availableAmount}
                  data-testid="input-withdraw-amount"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  USDT
                </span>
              </div>
              {numAmount > 0 && numAmount < minWithdraw && (
                <p className="text-sm text-destructive">Minimum withdrawal is ${minWithdraw}</p>
              )}
              {numAmount > availableAmount && (
                <p className="text-sm text-destructive">Insufficient balance</p>
              )}
            </div>

            <Alert className="glass border-info/20">
              <AlertCircle className="h-4 w-4 text-info" />
              <AlertDescription className="text-sm">
                Withdrawals are processed instantly. A small gas fee will be required to complete the transaction.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 glass hover-elevate"
                data-testid="button-cancel-withdraw"
              >
                Cancel
              </Button>
              <Button
                onClick={handleWithdraw}
                disabled={!isValid || isWithdrawing}
                className="flex-1 hover-elevate"
                data-testid="button-confirm-withdraw"
              >
                {isWithdrawing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Withdraw $${numAmount.toFixed(2)}`
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "confirming" && (
          <div className="space-y-6 py-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Confirming Transaction</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we process your withdrawal...
              </p>
            </div>
            <Progress value={66} className="w-full" />
          </div>
        )}

        {step === "success" && (
          <div className="space-y-6 py-8 text-center animate-scale-in">
            <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-success">Withdrawal Successful!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your withdrawal of ${numAmount.toFixed(2)} USDT has been processed.
              </p>
              {txHash && (
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                  <p className="font-mono text-xs truncate">{txHash}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
