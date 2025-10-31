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
  Coins,
  Brain,
  Cpu,
  Network,
  Lock
} from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  const stats = [
    { label: "Total Value Locked", value: "$1.2M", icon: Coins },
    { label: "Active Users", value: "3,450+", icon: Users },
    { label: "Total Rewards Paid", value: "$850K", icon: TrendingUp },
    { label: "AI Success Rate", value: "98.7%", icon: Brain },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms optimize returns and predict market trends in real-time",
    },
    {
      icon: Shield,
      title: "Fully Decentralized",
      description: "100% on-chain execution with ReentrancyGuard and comprehensive smart contract security",
    },
    {
      icon: TrendingUp,
      title: "Fixed Daily ROI",
      description: "Earn 1.0% to 2.5% daily returns powered by AI-driven yield optimization strategies",
    },
    {
      icon: Network,
      title: "5-Level Referrals",
      description: "Automated multi-level commission distribution up to 30% leveraging blockchain technology",
    },
    {
      icon: Cpu,
      title: "Real-Time Processing",
      description: "Per-second reward calculations with instant on-chain settlement and zero delays",
    },
    {
      icon: Lock,
      title: "Maximum Security",
      description: "Audited smart contracts with emergency pause functionality and transparent code",
    },
  ];

  const packages = [
    { name: "Starter", min: 5, max: 19, roi: 1.0, color: "from-cyan-400 to-blue-500", daily: 0.05 },
    { name: "Bronze", min: 20, max: 49, roi: 1.5, color: "from-orange-400 to-amber-500", daily: 0.30 },
    { name: "Silver", min: 50, max: 499, roi: 1.8, color: "from-gray-300 to-gray-500", daily: 0.90 },
    { name: "Gold", min: 500, max: 999, roi: 2.0, color: "from-yellow-400 to-yellow-600", daily: 10.00 },
    { name: "Diamond", min: 1000, max: 3000, roi: 2.5, color: "from-purple-500 to-pink-600", daily: 25.00 },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-chart-2/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="container relative mx-auto px-4 py-20 md:py-32 z-10">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-8 inline-block animate-slide-up">
              <div className="flex items-center justify-center gap-2 rounded-full cyber-border glass px-6 py-3 text-sm font-medium animate-glow-ring">
                <Brain className="h-5 w-5 text-primary animate-pulse" />
                <span className="ai-text font-semibold">AI-Powered Investment Protocol</span>
                <Zap className="h-5 w-5 text-accent animate-pulse" />
              </div>
            </div>
            
            <h1 className="mb-8 text-6xl md:text-8xl font-bold tracking-tight animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <span className="ai-text block mb-4">
                Decentralized Investment
              </span>
              <span className="text-foreground block">Platform</span>
            </h1>
            
            <p className="mb-12 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: "0.2s" }}>
              Experience the future of passive income with{" "}
              <span className="text-primary font-semibold">AI-driven yield optimization</span> and{" "}
              <span className="text-accent font-semibold">fully decentralized</span> smart contract technology.
              Build your automated wealth with transparent, per-second reward accrual.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Link href="/dashboard">
                <Button size="lg" className="group px-12 py-8 text-xl hover-elevate ai-gradient border-0 shadow-neon" data-testid="button-connect-wallet">
                  <Wallet className="mr-3 h-6 w-6" />
                  Connect Wallet
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-12 py-8 text-xl glass cyber-border" data-testid="button-learn-more">
                <Shield className="mr-3 h-6 w-6" />
                Learn More
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              {stats.map((stat, index) => (
                <Card key={index} className="glass cyber-border hover-elevate transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 md:p-8 text-center">
                    <stat.icon className="h-10 w-10 mx-auto mb-3 text-primary animate-pulse" />
                    <div className="text-3xl md:text-4xl font-bold ai-text mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm md:text-base text-muted-foreground font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 md:py-40 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block mb-6 px-6 py-2 rounded-full glass cyber-border">
              <span className="text-sm font-semibold text-primary">ADVANCED FEATURES</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="ai-text">AI-Enhanced Platform</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built on cutting-edge blockchain with artificial intelligence for maximum returns
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="glass cyber-border hover-elevate transition-all duration-500 group hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="mb-6 inline-flex p-4 rounded-xl ai-gradient group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-background" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 gradient-text from-primary to-accent">{feature.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Packages */}
      <section className="py-32 md:py-40 bg-gradient-to-b from-background via-card/30 to-background relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <div className="inline-block mb-6 px-6 py-2 rounded-full glass cyber-border">
              <span className="text-sm font-semibold text-accent">INVESTMENT TIERS</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="ai-text">Choose Your Package</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Select your investment tier and start earning AI-optimized daily returns
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
            {packages.map((pkg, index) => (
              <Card 
                key={index} 
                className="glass cyber-border hover-elevate hover:scale-105 transition-all duration-500 group relative overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`card-package-${pkg.name.toLowerCase()}`}
              >
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${pkg.color} animate-gradient`} />
                <div className={`absolute inset-0 bg-gradient-to-br ${pkg.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <CardContent className="p-8 relative">
                  <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${pkg.color} text-background text-sm font-bold mb-6 shadow-lg`}>
                    {pkg.name}
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-5xl font-bold ai-text mb-2">
                      {pkg.roi}%
                    </div>
                    <div className="text-base text-muted-foreground font-medium">Daily ROI</div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-base">
                      <div className={`p-1 rounded-full bg-gradient-to-r ${pkg.color}`}>
                        <CheckCircle2 className="h-4 w-4 text-background" />
                      </div>
                      <span className="font-medium">${pkg.min} - ${pkg.max}</span>
                    </div>
                    <div className="flex items-center gap-3 text-base">
                      <div className={`p-1 rounded-full bg-gradient-to-r ${pkg.color}`}>
                        <CheckCircle2 className="h-4 w-4 text-background" />
                      </div>
                      <span className="font-medium">200% Max Return</span>
                    </div>
                    <div className="flex items-center gap-3 text-base">
                      <div className={`p-1 rounded-full bg-gradient-to-r ${pkg.color}`}>
                        <CheckCircle2 className="h-4 w-4 text-background" />
                      </div>
                      <span className="font-medium">Per-Second Accrual</span>
                    </div>
                    <div className="flex items-center gap-3 text-base">
                      <div className={`p-1 rounded-full bg-gradient-to-r ${pkg.color}`}>
                        <Brain className="h-4 w-4 text-background" />
                      </div>
                      <span className="font-medium">AI Optimized</span>
                    </div>
                  </div>
                  
                  <div className="text-center mb-6 p-4 rounded-lg glass">
                    <div className="text-sm text-muted-foreground mb-1">Daily Earnings @ $100</div>
                    <div className="text-2xl font-bold text-success">${pkg.daily.toFixed(2)}</div>
                  </div>
                  
                  <Link href="/dashboard">
                    <Button 
                      className={`w-full py-6 text-base font-bold hover-elevate transition-all duration-300 ${index === 4 ? 'ai-gradient border-0 shadow-neon-accent' : 'glass cyber-border'}`}
                      variant={index === 4 ? "default" : "outline"} 
                      data-testid={`button-select-${pkg.name.toLowerCase()}`}
                    >
                      {index === 4 ? <><Zap className="mr-2 h-5 w-5" /> Select Premium</> : 'Select Package'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 md:py-40">
        <div className="container mx-auto px-4">
          <Card className="glass cyber-border max-w-5xl mx-auto overflow-hidden relative animate-glow-ring">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-chart-2/20 animate-gradient" />
            <CardContent className="p-16 md:p-24 text-center relative">
              <div className="mb-8 inline-flex items-center gap-2 px-6 py-3 rounded-full glass cyber-border">
                <Cpu className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm font-semibold">START EARNING TODAY</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-bold mb-8">
                <span className="ai-text block mb-2">Ready to Build</span>
                <span className="text-foreground">Passive Income?</span>
              </h2>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of investors earning daily returns with our AI-powered, fully decentralized platform. 
                Connect your wallet and start your journey to financial freedom.
              </p>
              
              <Link href="/dashboard">
                <Button size="lg" className="px-16 py-10 text-2xl hover-elevate group ai-gradient border-0 shadow-neon" data-testid="button-get-started">
                  <Wallet className="mr-4 h-8 w-8" />
                  Get Started Now
                  <ArrowRight className="ml-4 h-8 w-8 transition-transform group-hover:translate-x-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl ai-gradient flex items-center justify-center">
              <Brain className="h-7 w-7 text-background" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold ai-text">Rapidost</div>
              <div className="text-sm text-muted-foreground">AI-Powered DeFi Platform</div>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Powered by advanced smart contracts and artificial intelligence
          </p>
          <p className="text-muted-foreground/60 text-xs mt-4">
            © 2025 Rapidost. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
