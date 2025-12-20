import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, DollarSign, Bitcoin } from 'lucide-react';

export default function Portfolio({ 
  balance = 10000, 
  btcHolding = 0,
  totalTrades = 0,
  profitLoss = 0,
  winRate = 0
}) {
  const profitLossPercentage = ((profitLoss / balance) * 100) || 0;
  const isProfit = profitLoss >= 0;

  const stats = [
    {
      title: "Account Balance",
      value: `$${balance.toLocaleString()}`,
      icon: Wallet,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      title: "BTC Holdings",
      value: `${btcHolding.toFixed(6)} BTC`,
      icon: Bitcoin,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20"
    },
    {
      title: "Total Trades",
      value: totalTrades.toString(),
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20"
    },
    {
      title: "Win Rate",
      value: `${winRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: winRate >= 50 ? "text-green-400" : "text-red-400",
      bgColor: winRate >= 50 ? "bg-green-500/20" : "bg-red-500/20"
    }
  ];

  return (
    <div className="space-y-4">
      {/* P&L Summary Card */}
      <Card className="glass-card trading-glow">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Portfolio Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400 mb-1">Total P&L</div>
              <div className={`text-2xl font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                {isProfit ? '+' : ''}${profitLoss.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400 mb-1">Percentage</div>
              <div className={`text-xl font-semibold flex items-center gap-1 ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {isProfit ? '+' : ''}{profitLossPercentage.toFixed(2)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}