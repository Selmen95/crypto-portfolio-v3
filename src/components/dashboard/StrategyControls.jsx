import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, TrendingUp, Activity, Zap, BarChartHorizontal } from 'lucide-react';

export default function StrategyControls({ 
  smaEnabled = false, 
  rsiEnabled = false,
  bollingerEnabled = false,
  onToggleStrategy,
  isLoading = false
}) {
  const [localSmaEnabled, setLocalSmaEnabled] = useState(smaEnabled);
  const [localRsiEnabled, setLocalRsiEnabled] = useState(rsiEnabled);
  const [localBollingerEnabled, setLocalBollingerEnabled] = useState(bollingerEnabled);

  const handleToggle = async (strategy) => {
    let currentState, setter;
    if (strategy === 'sma_crossover') {
      [currentState, setter] = [localSmaEnabled, setLocalSmaEnabled];
    } else if (strategy === 'rsi_mean_reversion') {
      [currentState, setter] = [localRsiEnabled, setLocalRsiEnabled];
    } else {
        [currentState, setter] = [localBollingerEnabled, setLocalBollingerEnabled];
    }
    
    const newState = !currentState;
    setter(newState);

    if (onToggleStrategy) {
      try {
        await onToggleStrategy(strategy, newState);
      } catch (error) {
        setter(!newState); // Revert on error
        console.error('Failed to toggle strategy:', error);
      }
    }
  };

  const strategies = [
    {
      id: 'sma_crossover',
      name: 'Moving Average Crossover',
      description: 'Classic trend-following strategy',
      enabled: localSmaEnabled,
      icon: TrendingUp,
      color: 'blue'
    },
    {
      id: 'rsi_mean_reversion',
      name: 'RSI Mean Reversion',
      description: 'Identifies overbought/oversold levels',
      enabled: localRsiEnabled,
      icon: Activity,
      color: 'purple'
    },
    {
      id: 'bollinger_bands',
      name: 'Bollinger Bands Squeeze',
      description: 'Volatility-based breakout strategy',
      enabled: localBollingerEnabled,
      icon: BarChartHorizontal,
      color: 'amber'
    }
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Trading Strategies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {strategies.map((strategy) => (
          <div key={strategy.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-${strategy.color}-500/20 flex items-center justify-center`}>
                <strategy.icon className={`w-4 h-4 text-${strategy.color}-400`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-white">{strategy.name}</h3>
                  <Badge 
                    variant="outline" 
                    className={strategy.enabled 
                      ? 'text-green-400 border-green-400' 
                      : 'text-slate-400 border-slate-600'
                    }
                  >
                    {strategy.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-slate-400 mt-1">{strategy.description}</p>
              </div>
            </div>
            <Switch
              checked={strategy.enabled}
              onCheckedChange={() => handleToggle(strategy.id)}
              disabled={isLoading}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        ))}
        
        <div className="pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Risk per trade:</span>
            <span className="text-white font-medium">1.0%</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-slate-400">Max concurrent trades:</span>
            <span className="text-white font-medium">3</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full mt-4 border-slate-600 text-slate-300 hover:bg-slate-800"
          disabled={isLoading}
        >
          <Zap className="w-4 h-4 mr-2" />
          {isLoading ? 'Updating...' : 'Advanced Settings'}
        </Button>
      </CardContent>
    </Card>
  );
}