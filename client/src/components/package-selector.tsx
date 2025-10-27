import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PACKAGE_TIERS, getPackageTier } from "@shared/schema";
import { CheckCircle2, TrendingUp, Shield, Zap, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWallet } from "@/hooks/use-wallet";
import { useContract } from "@/hooks/use-contract";

export function PackageSelector() {
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"amount" | "approve" | "confirm">("amount");
  const [referrer, setReferrer] = useState("");
  
  const { address, isConnected } = useWallet();
  const { approve, deposit, isLoading } = useContract(address);

  const numAmount = parseFloat(amount) || 0;
  const selectedTier = getPackageTier(numAmount);

  const handleApprove = async () => {
    if (!isConnected || !amount) return;
    
    try {
      await approve(amount);
      setStep("confirm");
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const handleDeposit = async () => {
    if (!isConnected || !amount) return;
    
    try {
      await deposit(amount, referrer);
      setStep("amount");
      setAmount("");
      setReferrer("");
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Investment Form */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Stake USDT
            </CardTitle>
            <CardDescription>Choose your investment amount and start earning daily rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Investment Amount (USDT)</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount (5 - 3000)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-16 text-lg font-semibold"
                  min="5"
                  max="3000"
                  disabled={step !== "amount"}
                  data-testid="input-investment-amount"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  USDT
                </span>
              </div>
              {numAmount > 0 && !selectedTier && (
                <p className="text-sm text-destructive">Amount must be between $5 and $3000</p>
              )}
            </div>

            {selectedTier && (
              <div className="space-y-4 animate-slide-up">
                <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={`bg-gradient-to-r ${
                      selectedTier.name === "Starter" ? "from-blue-500 to-cyan-500" :
                      selectedTier.name === "Bronze" ? "from-orange-500 to-amber-500" :
                      selectedTier.name === "Silver" ? "from-gray-400 to-gray-500" :
                      selectedTier.name === "Gold" ? "from-yellow-400 to-yellow-500" :
                      "from-purple-500 to-pink-500"
                    }`}>
                      {selectedTier.name} Package
                    </Badge>
                    <span className="text-2xl font-bold gradient-text from-primary to-accent">
                      {selectedTier.dailyROI}% Daily
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Daily Earnings</p>
                      <p className="font-semibold text-success">
                        ${(numAmount * selectedTier.dailyROI / 100).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Max Return</p>
                      <p className="font-semibold">
                        ${(numAmount * 2).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <Alert className="glass border-info/20">
                  <AlertCircle className="h-4 w-4 text-info" />
                  <AlertDescription className="text-sm">
                    Your investment will earn <strong>{selectedTier.dailyROI}%</strong> daily until reaching 200% total return.
                    Rewards accrue per second and can be claimed anytime (minimum $5).
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  {!isConnected && (
                    <Alert className="glass border-warning/20">
                      <AlertCircle className="h-4 w-4 text-warning" />
                      <AlertDescription className="text-sm">
                        Please connect your wallet to continue
                      </AlertDescription>
                    </Alert>
                  )}

                  {step === "amount" && (
                    <Button
                      onClick={handleApprove}
                      className="w-full hover-elevate group py-6 text-lg"
                      disabled={!selectedTier || isLoading || !isConnected}
                      data-testid="button-approve-usdt"
                    >
                      <Shield className="h-5 w-5 mr-2" />
                      {isLoading ? "Approving..." : "Approve USDT"}
                    </Button>
                  )}

                  {step === "approve" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Waiting for approval...</span>
                        <Progress value={66} className="w-24 h-2" />
                      </div>
                    </div>
                  )}

                  {step === "confirm" && (
                    <Button
                      onClick={handleDeposit}
                      className="w-full hover-elevate group py-6 text-lg"
                      disabled={isLoading}
                      data-testid="button-deposit"
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      {isLoading ? "Depositing..." : `Deposit $${numAmount} USDT`}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Package Comparison */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>All Packages</CardTitle>
            <CardDescription>Compare investment tiers and daily returns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PACKAGE_TIERS.map((tier, index) => (
                <button
                  key={index}
                  onClick={() => setAmount(tier.min.toString())}
                  className={`p-4 rounded-lg border-2 text-left transition-all hover-elevate ${
                    selectedTier?.name === tier.name
                      ? "border-primary bg-primary/10"
                      : "border-border/50 glass"
                  }`}
                  data-testid={`button-quick-select-${tier.name.toLowerCase()}`}
                >
                  <Badge className={`mb-2 bg-gradient-to-r ${
                    tier.name === "Starter" ? "from-blue-500 to-cyan-500" :
                    tier.name === "Bronze" ? "from-orange-500 to-amber-500" :
                    tier.name === "Silver" ? "from-gray-400 to-gray-500" :
                    tier.name === "Gold" ? "from-yellow-400 to-yellow-500" :
                    "from-purple-500 to-pink-500"
                  }`}>
                    {tier.name}
                  </Badge>
                  <div className="text-2xl font-bold gradient-text from-primary to-accent mb-2">
                    {tier.dailyROI}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${tier.min} - ${tier.max}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment Benefits */}
      <div className="space-y-6">
        <Card className="glass border-success/20">
          <CardHeader>
            <CardTitle className="text-lg">Investment Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Fixed Daily Returns</p>
                <p className="text-sm text-muted-foreground">Earn 1.0% to 2.5% every 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Per-Second Accrual</p>
                <p className="text-sm text-muted-foreground">Rewards calculated every second</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">200% Total Return</p>
                <p className="text-sm text-muted-foreground">Double your investment cap</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Referral Bonuses</p>
                <p className="text-sm text-muted-foreground">Earn up to 30% from network</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Instant Withdrawals</p>
                <p className="text-sm text-muted-foreground">Claim rewards anytime (min $5)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-6">
            <Shield className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Smart Contract Security</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your investment is protected by audited smart contracts with ReentrancyGuard and emergency pause functionality.
            </p>
            <Button variant="outline" size="sm" className="w-full glass hover-elevate" data-testid="button-view-contract">
              View Contract
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
