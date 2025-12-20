import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownToLine, ArrowUpFromLine, Copy, QrCode, Shield } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DepositWithdraw({ wallets = [], onTransaction }) {
  const [selectedCurrency, setSelectedCurrency] = useState('BTC');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const selectedWallet = wallets.find(w => w.currency === selectedCurrency) || {};
  const depositAddress = selectedWallet.wallet_address || `${selectedCurrency.toLowerCase()}1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`;

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawAddress) {
      setMessage('Please fill in all fields');
      return;
    }

    if (parseFloat(withdrawAmount) > selectedWallet.balance) {
      setMessage('Insufficient balance');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate withdrawal processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onTransaction) {
        await onTransaction({
          type: 'withdrawal',
          currency: selectedCurrency,
          amount: parseFloat(withdrawAmount),
          address: withdrawAddress,
          status: 'pending'
        });
      }

      setMessage('Withdrawal submitted successfully!');
      setWithdrawAmount('');
      setWithdrawAddress('');
    } catch (error) {
      setMessage('Error processing withdrawal');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessage('Address copied to clipboard!');
    setTimeout(() => setMessage(''), 3000);
  };

  const networks = {
    BTC: ['Bitcoin Network'],
    ETH: ['Ethereum (ERC20)'],
    USDT: ['Ethereum (ERC20)', 'Binance Smart Chain (BEP20)', 'Tron (TRC20)'],
    BNB: ['Binance Smart Chain (BEP20)'],
    ADA: ['Cardano Network'],
    SOL: ['Solana Network'],
    DOT: ['Polkadot Network'],
    AVAX: ['Avalanche C-Chain'],
    MATIC: ['Polygon Network'],
    LTC: ['Litecoin Network']
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white">Deposit & Withdraw</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label className="text-slate-300 mb-2 block">Select Currency</Label>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {wallets.map((wallet) => (
                <SelectItem key={wallet.currency} value={wallet.currency}>
                  <div className="flex items-center gap-2">
                    <span>{wallet.currency}</span>
                    <span className="text-slate-400">
                      ({wallet.balance.toFixed(6)})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {message && (
          <Alert className="mb-4 bg-blue-500/20 border-blue-500/30">
            <AlertDescription className="text-blue-400">
              {message}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="deposit" className="data-[state=active]:bg-green-600">
              <ArrowDownToLine className="w-4 h-4 mr-2" />
              Deposit
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="data-[state=active]:bg-red-600">
              <ArrowUpFromLine className="w-4 h-4 mr-2" />
              Withdraw
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deposit" className="mt-4 space-y-4">
            <div className="space-y-3">
              <Label className="text-slate-300">Network</Label>
              <Select defaultValue={networks[selectedCurrency]?.[0]}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {networks[selectedCurrency]?.map((network) => (
                    <SelectItem key={network} value={network}>
                      {network}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-slate-300">Deposit Address</Label>
              <div className="flex gap-2">
                <Input
                  value={depositAddress}
                  readOnly
                  className="bg-slate-800 border-slate-600 text-white font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(depositAddress)}
                  className="border-slate-600"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-slate-600"
                >
                  <QrCode className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Alert className="bg-yellow-500/20 border-yellow-500/30">
              <Shield className="w-4 h-4" />
              <AlertDescription className="text-yellow-400">
                Send only {selectedCurrency} to this address. Sending other assets may result in permanent loss.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="withdraw" className="mt-4 space-y-4">
            <div className="space-y-3">
              <Label className="text-slate-300">Withdrawal Address</Label>
              <Input
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                placeholder={`Enter ${selectedCurrency} address`}
                className="bg-slate-800 border-slate-600 text-white font-mono"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-slate-300">Amount</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00000000"
                  className="bg-slate-800 border-slate-600 text-white"
                />
                <Button
                  variant="outline"
                  onClick={() => setWithdrawAmount(selectedWallet.balance?.toString() || '0')}
                  className="border-slate-600 text-slate-300"
                >
                  Max
                </Button>
              </div>
              <div className="text-sm text-slate-400">
                Available: {selectedWallet.balance?.toFixed(6) || '0'} {selectedCurrency}
              </div>
            </div>

            <div className="space-y-2 p-3 bg-slate-800/50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Network Fee:</span>
                <span className="text-white">0.0001 {selectedCurrency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">You'll receive:</span>
                <span className="text-green-400 font-semibold">
                  {withdrawAmount ? (parseFloat(withdrawAmount) - 0.0001).toFixed(6) : '0'} {selectedCurrency}
                </span>
              </div>
            </div>

            <Button 
              onClick={handleWithdraw}
              disabled={isProcessing || !withdrawAmount || !withdrawAddress}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? 'Processing...' : `Withdraw ${selectedCurrency}`}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}