import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, DollarSign, Target } from "lucide-react";
import { useEffect, useState } from "react";

interface InvestmentCardProps {
  investment: {
    amount: number;
    dailyROI: number;
    startDate: number;
    totalClaimed: number;
    progress: number;
  };
}

export function InvestmentCard({ investment }: InvestmentCardProps) {
  const [currentReward, setCurrentReward] = useState(0);

  // Simulate real-time reward accrual
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - investment.startDate) / 1000;
      const days = elapsed / 86400;
      const totalEarned = (investment.amount * investment.dailyROI * days) / 100;
      const available = Math.max(0, totalEarned - investment.totalClaimed);
      setCurrentReward(Math.min(available, investment.amount * 2 - investment.totalClaimed));
    }, 1000);

    return () => clearInterval(interval);
  }, [investment]);

  const daysActive = Math.floor((Date.now() - investment.startDate) / (1000 * 60 * 60 * 24));
  const dailyEarnings = (investment.amount * investment.dailyROI) / 100;
  const maxReturn = investment.amount * 2;

  return (
    <Card className="glass border-primary/20 overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-gradient-shift" />
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Active Investment
            </CardTitle>
            <CardDescription>Diamond Package - 2.5% Daily ROI</CardDescription>
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
            Active
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Investment</span>
            </div>
            <p className="text-2xl font-bold gradient-text from-primary to-accent">
              ${investment.amount.toFixed(2)}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Accrued</span>
            </div>
            <p className="text-2xl font-bold text-success animate-pulse-glow" data-testid="text-accrued-rewards">
              ${currentReward.toFixed(4)}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">Max Return</span>
            </div>
            <p className="text-2xl font-bold gradient-text from-accent to-primary">
              ${maxReturn.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Progress to Cap */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress to 200% Cap</span>
            <span className="font-semibold">{investment.progress}%</span>
          </div>
          <div className="relative">
            <Progress value={investment.progress} className="h-3" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white shadow-lg animate-pulse" 
                   style={{ marginLeft: `${investment.progress - 50}%` }} />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>${investment.totalClaimed.toFixed(2)} claimed</span>
            <span>${(maxReturn - investment.totalClaimed - currentReward).toFixed(2)} remaining</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted/50">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Days Active</p>
              <p className="font-semibold">{daysActive} days</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted/50">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Daily Earnings</p>
              <p className="font-semibold text-success">${dailyEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
