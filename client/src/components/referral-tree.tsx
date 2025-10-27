import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { REFERRAL_LEVELS } from "@shared/schema";
import { Users, TrendingUp, Award } from "lucide-react";

export function ReferralTree() {
  // Mock data - will be replaced with real data from smart contract
  const referralData = [
    { level: 1, count: 3, earned: 45.50 },
    { level: 2, count: 8, earned: 12.30 },
    { level: 3, count: 15, earned: 8.20 },
    { level: 4, count: 12, earned: 4.50 },
    { level: 5, count: 5, earned: 2.10 },
  ];

  const totalReferrals = referralData.reduce((sum, level) => sum + level.count, 0);
  const totalEarned = referralData.reduce((sum, level) => sum + level.earned, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="glass border-primary/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Referrals</p>
              <p className="text-2xl font-bold gradient-text from-primary to-accent">
                {totalReferrals}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-success/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Earned</p>
              <p className="text-2xl font-bold text-success">
                ${totalEarned.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-accent/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <Award className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Top Performer</p>
              <p className="text-2xl font-bold gradient-text from-accent to-primary">
                Level 1
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Levels */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Commission Levels
          </CardTitle>
          <CardDescription>
            Your multi-level referral network breakdown
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {REFERRAL_LEVELS.map((level, index) => {
            const data = referralData[index];
            return (
              <div
                key={level.level}
                className="p-4 rounded-lg glass border border-primary/20 hover-elevate transition-all group"
                data-testid={`card-referral-level-${level.level}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${level.color} flex items-center justify-center text-white font-bold text-lg`}>
                      L{level.level}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Level {level.level}</span>
                        <Badge variant="outline" className="text-xs">
                          {level.percentage}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {data.count} referral{data.count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-success" data-testid={`text-level-${level.level}-earned`}>
                      ${data.earned.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">earned</p>
                  </div>
                </div>

                {/* Visual representation */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(data.count, 10) }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-full rounded-full bg-gradient-to-r ${level.color} opacity-70 group-hover:opacity-100 transition-opacity`}
                      style={{ animationDelay: `${i * 0.05}s` }}
                    />
                  ))}
                  {data.count > 10 && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      +{data.count - 10} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Summary */}
          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Commission Rate</span>
              <span className="font-semibold text-primary">30%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Champion Award */}
      <Card className="glass border-chart-4/20 bg-gradient-to-br from-chart-4/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-chart-4/10">
              <Award className="h-6 w-6 text-chart-4" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Champion Award</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Refer 50+ users and get $50 bonus reward! Keep building your network.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted/50 rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-chart-4 to-chart-5 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (totalReferrals / 50) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{totalReferrals}/50</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
