import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function WalletOverview({ 
  wallets = [], 
  totalValueUSD = 0, 
  showBalances = true, 
  onToggleBalances 
}) {
  const getCryptoIcon = (currency) => {
    const colors = {
      BTC: 'text-orange-400',
      ETH: 'text-blue-400', 
      USDT: 'text-green-400',
      BNB: 'text-yellow-400',
      ADA: 'text-purple-400',
      SOL: 'text-violet-400',
      DOT: 'text-pink-400',
      AVAX: 'text-red-400',
      MATIC: 'text-indigo-400',
      LTC: 'text-gray-400'
    };
    return colors[currency] || 'text-slate-400';
  };

  const formatBalance = (amount) => {
    if (!showBalances) return '****';
    return amount < 1 ? amount.toFixed(6) : amount.toFixed(4);
  };

  const formatUSD = (amount) => {
    if (!showBalances) return '$****';
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Total Balance Card */}
      <Card className="glass-card trading-glow">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Total Portfolio Value
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleBalances}
              className="text-slate-400 hover:text-white"
            >
              {showBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-white mb-1">
                {formatUSD(totalValueUSD)}
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+5.2% (24h)</span>
              </div>
            </div>
            <div className="text-right text-slate-400">
              <div className="text-sm">Available</div>
              <div className="font-semibold text-white">
                {formatUSD(totalValueUSD * 0.95)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {wallets.map((wallet, index) => (
          <Card key={wallet.id || index} className="glass-card hover:bg-slate-800/30 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center`}>
                    <span className={`font-bold text-sm ${getCryptoIcon(wallet.currency)}`}>
                      {wallet.currency}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{wallet.currency}</div>
                    <div className="text-xs text-slate-400">
                      {wallet.network || 'Mainnet'}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-slate-400 border-slate-600">
                  Active
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Available:</span>
                  <span className="text-white font-mono">
                    {formatBalance(wallet.balance)}
                  </span>
                </div>
                
                {wallet.locked_balance > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">In Orders:</span>
                    <span className="text-yellow-400 font-mono">
                      {formatBalance(wallet.locked_balance)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm pt-2 border-t border-slate-700">
                  <span className="text-slate-400">USD Value:</span>
                  <span className="text-green-400 font-semibold">
                    {formatUSD(wallet.balance * 44000)} {/* Mock price */}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add New Wallet Card */}
        <Card className="glass-card border-dashed border-slate-600 hover:border-green-400 transition-colors cursor-pointer">
          <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[140px]">
            <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mb-3">
              <Wallet className="w-6 h-6 text-slate-400" />
            </div>
            <div className="text-slate-400 text-sm text-center">
              <div className="font-medium">Add Currency</div>
              <div className="text-xs">Enable new crypto</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}