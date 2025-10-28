import { useState, useEffect } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { useContract } from "@/hooks/use-contract";
import { useQuery } from "@tanstack/react-query";
import { formatEther, parseEther } from "ethers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Copy, 
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Shield,
  Clock
} from "lucide-react";
import { PackageSelector } from "@/components/package-selector";
import { ReferralTree } from "@/components/referral-tree";
import { InvestmentCard } from "@/components/investment-card";
import { WithdrawModal } from "@/components/withdraw-modal";
import { WalletButton } from "@/components/wallet-button";

export default function Dashboard() {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawType, setWithdrawType] = useState<"rewards" | "referral">("rewards");
  
  const { address, isConnected } = useWallet();
  const { fetchUserData, fetchUSDTBalance } = useContract(address);
  
  // Fetch user data from blockchain
  const { data: userData, isLoading: isLoadingUser, refetch: refetchUserData } = useQuery({
    queryKey: ['/user-data', address],
    queryFn: fetchUserData,
    enabled: isConnected && !!address,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });
  
  const { data: usdtBalance } = useQuery({
    queryKey: ['/usdt-balance', address],
    queryFn: fetchUSDTBalance,
    enabled: isConnected && !!address,
    refetchInterval: 10000,
  });
  
  const stats = {
    totalInvested: userData?.totalInvested ? parseFloat(userData.totalInvested) : 0,
    availableRewards: userData?.availableRewards ? parseFloat(userData.availableRewards) : 0,
    totalWithdrawn: userData?.totalWithdrawn ? parseFloat(userData.totalWithdrawn) : 0,
    referralBalance: userData?.referralBalance ? parseFloat(userData.referralBalance) : 0,
    totalReferrals: userData?.totalReferrals || 0,
    activePackage: userData?.totalInvested && parseFloat(userData.totalInvested) > 0 ? {
      amount: parseFloat(userData.totalInvested),
      dailyROI: 2.0, // This would come from package tier
      startDate: Date.now() - 15 * 24 * 60 * 60 * 1000,
      totalClaimed: parseFloat(userData.totalWithdrawn || "0"),
      progress: Math.min((parseFloat(userData.totalWithdrawn || "0") / (parseFloat(userData.totalInvested) * 2)) * 100, 100),
    } : null,
  };

  const referralLink = address ? `${window.location.origin}?ref=${address}` : '';

  const copyReferralLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
    }
  };
  
  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="gradient-text from-primary to-accent">Connect Your Wallet</CardTitle>
            <CardDescription>Please connect your wallet to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <WalletButton />
            <p className="text-sm text-muted-foreground text-center">
              Connect with MetaMask or another Web3 wallet to view your investments and earnings
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text from-primary to-accent">Rapidost</h1>
                  <p className="text-xs text-muted-foreground">DeFi Platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium text-success">BSC Mainnet</span>
              </div>
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass border-primary/20 hover-elevate transition-all duration-300 animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-success" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Invested</p>
              <p className="text-3xl font-bold gradient-text from-primary to-accent" data-testid="text-total-invested">
                ${stats.totalInvested.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">USDT</p>
            </CardContent>
          </Card>

          <Card className="glass border-success/20 hover-elevate transition-all duration-300 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-success/10">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-success">
                  <ArrowUpRight className="h-3 w-3" />
                  +12.5%
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Available Rewards</p>
              <p className="text-3xl font-bold text-success animate-pulse-glow" data-testid="text-available-rewards">
                ${stats.availableRewards.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Ready to claim</p>
            </CardContent>
          </Card>

          <Card className="glass border-accent/20 hover-elevate transition-all duration-300 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Wallet className="h-5 w-5 text-accent" />
                </div>
                <ArrowDownRight className="h-4 w-4 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Withdrawn</p>
              <p className="text-3xl font-bold gradient-text from-accent to-primary" data-testid="text-total-withdrawn">
                ${stats.totalWithdrawn.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">USDT</p>
            </CardContent>
          </Card>

          <Card className="glass border-chart-2/20 hover-elevate transition-all duration-300 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-chart-2/10">
                  <Users className="h-5 w-5 text-chart-2" />
                </div>
                <Badge variant="outline" className="text-xs">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Referrals</p>
              <p className="text-3xl font-bold gradient-text from-chart-2 to-chart-3" data-testid="text-total-referrals">
                {stats.totalReferrals}
              </p>
              <p className="text-xs text-muted-foreground mt-2">${stats.referralBalance.toFixed(2)} earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="glass w-full justify-start overflow-x-auto">
            <TabsTrigger value="portfolio" className="flex-1 md:flex-none" data-testid="tab-portfolio">
              <Shield className="h-4 w-4 mr-2" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="invest" className="flex-1 md:flex-none" data-testid="tab-invest">
              <DollarSign className="h-4 w-4 mr-2" />
              Invest
            </TabsTrigger>
            <TabsTrigger value="referral" className="flex-1 md:flex-none" data-testid="tab-referral">
              <Users className="h-4 w-4 mr-2" />
              Referral
            </TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Active Investment */}
              <div className="lg:col-span-2 space-y-6">
                <InvestmentCard investment={stats.activePackage} />
                
                {/* Quick Actions */}
                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-primary" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>Manage your investments and earnings</CardDescription>
                  </CardHeader>
                  <CardContent className="grid sm:grid-cols-2 gap-4">
                    <Button 
                      className="w-full hover-elevate group" 
                      onClick={() => { setWithdrawType("rewards"); setShowWithdraw(true); }}
                      disabled={stats.availableRewards < 5}
                      data-testid="button-claim-rewards"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Claim Rewards
                      <ArrowUpRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full hover-elevate group glass"
                      onClick={() => { setWithdrawType("referral"); setShowWithdraw(true); }}
                      disabled={stats.referralBalance < 5}
                      data-testid="button-withdraw-referral"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Withdraw Referral
                      <ArrowUpRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Portfolio Status */}
              <div className="space-y-6">
                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Portfolio Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {stats.activePackage ? (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Next ROI Drop</span>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              2h 34m
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Daily Rate</span>
                            <span className="font-semibold text-success">+{stats.activePackage.dailyROI}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">VVIP Status</span>
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">Diamond</Badge>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-border/50">
                          <p className="text-xs text-muted-foreground mb-3">Minimum Withdrawal</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <Progress value={Math.min(100, (stats.availableRewards / 5) * 100)} className="h-2" />
                            </div>
                            <span className="text-xs font-medium">${stats.availableRewards.toFixed(2)} / $5.00</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border/50">
                          <p className="text-xs text-muted-foreground mb-3">Progress to 200% Cap</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <Progress value={stats.activePackage.progress} className="h-2" />
                            </div>
                            <span className="text-xs font-medium">{stats.activePackage.progress.toFixed(1)}%</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground mb-4">No active investment</p>
                        <p className="text-xs text-muted-foreground">Make your first deposit to start earning</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass border-success/20 bg-gradient-to-br from-success/5 to-transparent">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-success/10">
                        <Sparkles className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Auto-Reinvest</h3>
                        <p className="text-xs text-muted-foreground">Coming Soon</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Automatically reinvest your rewards to compound your earnings
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Invest Tab */}
          <TabsContent value="invest">
            <PackageSelector />
          </TabsContent>

          {/* Referral Tab */}
          <TabsContent value="referral" className="space-y-6">
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Your Referral Link
                </CardTitle>
                <CardDescription>Share this link to earn commissions from your network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-lg bg-muted/50 border border-border font-mono text-sm">
                    <span className="truncate" data-testid="text-referral-link">{referralLink}</span>
                  </div>
                  <Button onClick={copyReferralLink} className="hover-elevate" data-testid="button-copy-referral">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="hover-elevate glass" data-testid="button-share-referral">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <ReferralTree />
          </TabsContent>
        </Tabs>
      </div>

      <WithdrawModal 
        open={showWithdraw} 
        onOpenChange={setShowWithdraw}
        type={withdrawType}
        availableAmount={withdrawType === "rewards" ? stats.availableRewards : stats.referralBalance}
      />
    </div>
  );
}
