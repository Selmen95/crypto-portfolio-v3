import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, DollarSign, TrendingUp, Shield, Target } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AutoTradeControls({ settings = {}, onUpdateSettings, isLoading = false }) {
  const [localSettings, setLocalSettings] = useState({
    enabled: false,
    take_profit_percentage: 5.0,
    stop_loss_percentage: 2.0,
    auto_cashout_enabled: false,
    cashout_percentage: 50.0,
    min_profit_to_cashout: 100.0,
    max_position_size: 1000.0,
    trading_pairs: ['BTC/USDT'],
    ...settings
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onUpdateSettings) {
        await onUpdateSettings(localSettings);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const tradingPairs = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT', 'XRP/USDT', 'DOT/USDT', 'DOGE/USDT', 'MATIC/USDT'];

  return (
    <div className="space-y-6">
      {/* Main Toggle */}
      <Card className="glass-card trading-glow">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Auto Trading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
            <div>
              <h3 className="font-semibold text-white">Enable Auto Trading</h3>
              <p className="text-sm text-slate-400 mt-1">
                Automatically execute trades based on your strategies
              </p>
            </div>
            <Switch
              checked={localSettings.enabled}
              onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
              className="data-[state=checked]:bg-green-500"
            />
          </div>

          {localSettings.enabled && (
            <Alert className="mt-4 bg-green-500/20 border-green-500/30">
              <TrendingUp className="w-4 h-4" />
              <AlertDescription className="text-green-400">
                Auto trading is active. Trades will be executed automatically based on your configured strategies.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Risk Management */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Risk Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Take Profit (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={localSettings.take_profit_percentage}
                onChange={(e) => handleSettingChange('take_profit_percentage', parseFloat(e.target.value))}
                className="bg-slate-800 border-slate-600 text-white"
              />
              <p className="text-xs text-slate-400">
                Automatically sell when profit reaches this percentage
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Stop Loss (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={localSettings.stop_loss_percentage}
                onChange={(e) => handleSettingChange('stop_loss_percentage', parseFloat(e.target.value))}
                className="bg-slate-800 border-slate-600 text-white"
              />
              <p className="text-xs text-slate-400">
                Automatically sell when loss reaches this percentage
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Max Position Size (USDT)</Label>
            <Input
              type="number"
              value={localSettings.max_position_size}
              onChange={(e) => handleSettingChange('max_position_size', parseFloat(e.target.value))}
              className="bg-slate-800 border-slate-600 text-white"
            />
            <p className="text-xs text-slate-400">
              Maximum amount to invest in a single position
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Auto Cashout */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Auto Cashout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
            <div>
              <h3 className="font-semibold text-white">Enable Auto Cashout</h3>
              <p className="text-sm text-slate-400 mt-1">
                Automatically convert profits to USDT
              </p>
            </div>
            <Switch
              checked={localSettings.auto_cashout_enabled}
              onCheckedChange={(checked) => handleSettingChange('auto_cashout_enabled', checked)}
              className="data-[state=checked]:bg-green-500"
            />
          </div>

          {localSettings.auto_cashout_enabled && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Cashout Percentage (%)</Label>
                  <Input
                    type="number"
                    step="1"
                    value={localSettings.cashout_percentage}
                    onChange={(e) => handleSettingChange('cashout_percentage', parseFloat(e.target.value))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <p className="text-xs text-slate-400">
                    Percentage of profits to convert to USDT
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Minimum Profit (USDT)</Label>
                  <Input
                    type="number"
                    value={localSettings.min_profit_to_cashout}
                    onChange={(e) => handleSettingChange('min_profit_to_cashout', parseFloat(e.target.value))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <p className="text-xs text-slate-400">
                    Minimum profit required before auto cashout
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trading Pairs */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Trading Pairs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="text-slate-300">Active Trading Pairs</Label>
            <Select
              value={localSettings.trading_pairs[0] || 'BTC/USDT'}
              onValueChange={(value) => handleSettingChange('trading_pairs', [value])}
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {tradingPairs.map((pair) => (
                  <SelectItem key={pair} value={pair}>
                    {pair}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-400">
              Currently supporting single pair trading. Multi-pair coming soon.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button 
        onClick={handleSave}
        disabled={isSaving || isLoading}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {isSaving ? 'Saving...' : 'Save Auto Trading Settings'}
      </Button>
    </div>
  );
}