import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from 'lucide-react';

const markets = [
    {
        name: "BTC/USD",
        fullName: "Bitcoin",
        price: 44084.92,
        change: 2.45,
        icon: 'https://img.icons8.com/color/48/bitcoin--v1.png'
    },
    {
        name: "ETH/USD",
        fullName: "Ethereum",
        price: 1616.18,
        change: -1.23,
        icon: 'https://img.icons8.com/color/48/ethereum.png'
    },
    {
        name: "SOL/USD",
        fullName: "Solana",
        price: 99.24,
        change: 5.67,
        icon: 'https://img.icons8.com/nolan/64/solana.png'
    }
];

export default function LiveMarkets() {
  return (
    <Card className="bg-slate-900/50 border border-slate-800">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Live Markets</h3>
            <div className="flex items-center gap-2 text-green-400 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Real-time
            </div>
        </div>
        <div className="space-y-4">
            {markets.map(market => (
                <div key={market.name} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src={market.icon} alt={market.name} className="w-8 h-8" />
                        <div>
                            <p className="font-semibold">{market.name}</p>
                            <p className="text-sm text-slate-400">{market.fullName}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">${market.price.toLocaleString()}</p>
                        <div className={`flex items-center justify-end gap-1 text-sm ${market.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {market.change >= 0 ? <TrendingUp className="w-4 h-4"/> : <TrendingDown className="w-4 h-4"/>}
                            {market.change.toFixed(2)}%
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}