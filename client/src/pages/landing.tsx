import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  Shield, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Coins
} from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  const stats = [
    { label: "Total Value Locked", value: "$1.2M", icon: Coins },
    { label: "Active Users", value: "3,450+", icon: Users },
    { label: "Total Rewards Paid", value: "$850K", icon: TrendingUp },
    { label: "Daily ROI", value: "Up to 2.5%", icon: BarChart3 },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure & Audited",
      description: "Smart contracts with ReentrancyGuard and comprehensive security measures",
    },
    {
      icon: TrendingUp,
      title: "Fixed Daily ROI",
      description: "Earn 1.0% to 2.5% daily returns based on your investment package",
    },
    {
      icon: Users,
      title: "5-Level Referrals",
      description: "Earn up to 30% commission from your referral network automatically",
    },
    {
      icon: Zap,
      title: "Instant Rewards",
      description: "Real-time reward accrual with per-second calculations and instant claims",
    },
  ];

  const packages = [
    { name: "Starter", min: 5, max: 19, roi: 1.0, color: "from-blue-500 to-cyan-500" },
    { name: "Bronze", min: 20, max: 49, roi: 1.5, color: "from-orange-500 to-amber-500" },
    { name: "Silver", min: 50, max: 499, roi: 1.8, color: "from-gray-400 to-gray-500" },
    { name: "Gold", min: 500, max: 999, roi: 2.0, color: "from-yellow-400 to-yellow-500" },
    { name: "Diamond", min: 1000, max: 3000, roi: 2.5, color: "from-purple-500 to-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 animate-gradient-shift" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_65%)]" />
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-block animate-slide-up">
              <div className="flex items-center justify-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium">
                <Zap className="h-4 w-4 text-primary" />
                <span className="gradient-text from-primary to-accent">Powered by Smart Contracts</span>
              </div>
            </div>
            
            <h1 className="mb-6 text-5xl md:text-7xl font-bold tracking-tight animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <span className="gradient-text from-primary via-accent to-primary bg-[length:200%_auto]">
                Decentralized Investment
              </span>
              <br />
              <span className="text-foreground">Platform</span>
            </h1>
            
            <p className="mb-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Earn fixed daily returns powered by advanced smart contract technology. 
              Build your passive income with transparent, automated staking rewards.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Link href="/dashboard">
                <Button size="lg" className="group px-8 py-6 text-lg hover-elevate" data-testid="button-connect-wallet">
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg glass" data-testid="button-learn-more">
                Learn More
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              {stats.map((stat, index) => (
                <Card key={index} className="glass border-primary/20 hover-elevate transition-all duration-300">
                  <CardContent className="p-4 md:p-6 text-center">
                    <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl md:text-3xl font-bold gradient-text from-primary to-accent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text from-primary to-accent">Why Choose Us</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built on blockchain technology with security and transparency at its core
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="glass border-primary/20 hover-elevate transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Packages */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text from-primary to-accent">Investment Packages</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your investment tier and start earning fixed daily returns
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {packages.map((pkg, index) => (
              <Card 
                key={index} 
                className="glass border-primary/20 hover-elevate hover:scale-105 transition-all duration-300 group relative overflow-hidden"
                data-testid={`card-package-${pkg.name.toLowerCase()}`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${pkg.color}`} />
                <CardContent className="p-6">
                  <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${pkg.color} text-white text-sm font-semibold mb-4`}>
                    {pkg.name}
                  </div>
                  <div className="mb-4">
                    <div className="text-3xl font-bold gradient-text from-primary to-accent mb-1">
                      {pkg.roi}%
                    </div>
                    <div className="text-sm text-muted-foreground">Daily ROI</div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>${pkg.min} - ${pkg.max} USDT</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>200% Max Return</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>Per-Second Accrual</span>
                    </div>
                  </div>
                  <Link href="/dashboard">
                    <Button className="w-full hover-elevate" variant={index === 4 ? "default" : "outline"} data-testid={`button-select-${pkg.name.toLowerCase()}`}>
                      Select Package
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <Card className="glass border-primary/20 max-w-4xl mx-auto overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 animate-gradient-shift" />
            <CardContent className="p-12 md:p-16 text-center relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="gradient-text from-primary to-accent">Ready to Start Earning?</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Connect your wallet and choose your investment package to begin earning daily rewards
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="px-12 py-6 text-lg hover-elevate group" data-testid="button-get-started">
                  <Wallet className="mr-2 h-5 w-5" />
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
