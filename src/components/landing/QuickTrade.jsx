import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, RefreshCw } from 'lucide-react';

export default function QuickTrade() {
    const [fromAmount, setFromAmount] = useState(0.5);
    const [toAmount, setToAmount] = useState(12.847);
    const [fromCurrency, setFromCurrency] = useState('BTC');
    const [toCurrency, setToCurrency] = useState('ETH');

    const cryptoIcons = {
        BTC: 'https://img.icons8.com/color/48/bitcoin--v1.png',
        ETH: 'https://img.icons8.com/color/48/ethereum.png',
        SOL: 'https://img.icons8.com/nolan/64/solana.png',
    };

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    };

  return (
    <Card className="bg-slate-900/50 border border-slate-800">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg">Quick Trade</h3>
          <div className="flex items-center gap-2">
            <button className="text-slate-400 hover:text-white"><RefreshCw className="w-4 h-4" /></button>
          </div>
        </div>
        
        <div className="relative space-y-2">
            {/* From */}
            <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">From</span>
                    <span className="text-sm text-slate-400">Balance: 12.5847 {fromCurrency}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600">
                            <SelectValue>
                                <div className="flex items-center gap-2">
                                    <img src={cryptoIcons[fromCurrency]} alt={fromCurrency} className="w-5 h-5" />
                                    {fromCurrency}
                                </div>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="BTC">
                                <div className="flex items-center gap-2">
                                    <img src={cryptoIcons.BTC} alt="BTC" className="w-5 h-5" /> BTC
                                </div>
                            </SelectItem>
                            <SelectItem value="ETH">
                                <div className="flex items-center gap-2">
                                    <img src={cryptoIcons.ETH} alt="ETH" className="w-5 h-5" /> ETH
                                </div>
                            </SelectItem>
                             <SelectItem value="SOL">
                                <div className="flex items-center gap-2">
                                    <img src={cryptoIcons.SOL} alt="SOL" className="w-5 h-5" /> SOL
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Input 
                        type="number" 
                        value={fromAmount}
                        onChange={(e) => setFromAmount(e.target.value)}
                        className="text-right text-xl font-semibold bg-transparent border-none focus-visible:ring-0 p-0"
                    />
                </div>
                <p className="text-right text-sm text-slate-400 mt-1">~${(fromAmount * 43250).toLocaleString()}</p>
            </div>

            {/* Swap Button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <button onClick={handleSwap} className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded-full border-4 border-slate-900/50 text-slate-400 hover:bg-slate-600">
                    <ArrowDown className="w-4 h-4" />
                </button>
            </div>

            {/* To */}
            <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">To</span>
                    <span className="text-sm text-slate-400">Balance: 245.92 {toCurrency}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600">
                             <SelectValue>
                                <div className="flex items-center gap-2">
                                    <img src={cryptoIcons[toCurrency]} alt={toCurrency} className="w-5 h-5" />
                                    {toCurrency}
                                </div>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="BTC">
                                <div className="flex items-center gap-2">
                                    <img src={cryptoIcons.BTC} alt="BTC" className="w-5 h-5" /> BTC
                                </div>
                            </SelectItem>
                            <SelectItem value="ETH">
                                <div className="flex items-center gap-2">
                                    <img src={cryptoIcons.ETH} alt="ETH" className="w-5 h-5" /> ETH
                                </div>
                            </SelectItem>
                             <SelectItem value="SOL">
                                <div className="flex items-center gap-2">
                                    <img src={cryptoIcons.SOL} alt="SOL" className="w-5 h-5" /> SOL
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Input 
                        type="number" 
                        value={toAmount}
                        onChange={(e) => setToAmount(e.target.value)}
                        className="text-right text-xl font-semibold bg-transparent border-none focus-visible:ring-0 p-0"
                    />
                </div>
                <p className="text-right text-sm text-slate-400 mt-1">~${(toAmount * 1650).toLocaleString()}</p>
            </div>
        </div>

        <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-slate-400">
                <span>Exchange Rate</span>
                <span className="text-white">1 BTC = 25.694 ETH</span>
            </div>
            <div className="flex justify-between text-slate-400">
                <span>Network Fee</span>
                <span className="text-white">~$12.50</span>
            </div>
             <div className="flex justify-between text-slate-400">
                <span>Estimated Time</span>
                <span className="text-white">~2 minutes</span>
            </div>
        </div>

        <Button size="lg" className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90">Execute Trade</Button>
      </CardContent>
    </Card>
  );
}