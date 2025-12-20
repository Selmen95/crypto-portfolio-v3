import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function PriceChart({ 
    data = [], 
    currentPrice = 0, 
    priceChange = 0,
    selectedPair,
    onPairChange,
    selectedTimeframe,
    onTimeframeChange
}) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const transformedData = data.map(item => ({
      time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      price: parseFloat(item.close),
    })).slice(-100); 

    setChartData(transformedData);
  }, [data]);

  const isPositive = priceChange >= 0;

  const timeframes = ["1m", "5m", "15m", "30m", "1h", "2h", "4h", "1d", "1w"];
  const pairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "XRP/USDT", "ADA/USDT"];

  return (
    <Card className="glass-card trading-glow">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Select value={selectedPair} onValueChange={onPairChange}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 w-36">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {pairs.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">
                ${currentPrice.toLocaleString()}
              </span>
              <Badge 
                variant="outline" 
                className={`${isPositive ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'}`}
              >
                {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {timeframes.map(tf => (
                <Button 
                    key={tf} 
                    size="sm" 
                    variant={selectedTimeframe === tf ? "secondary" : "ghost"}
                    onClick={() => onTimeframeChange(tf)}
                    className="text-xs px-2"
                >
                    {tf}
                </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                orientation="right"
                domain={['dataMin - 100', 'dataMax + 100']}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#22C55E"
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}