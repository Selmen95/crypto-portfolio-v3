import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { TrendingDown, TrendingUp, Activity } from "lucide-react";

export default function ScenarioSimulator({ currentValue = 10000, assets = [] }) {
  const [marketChange, setMarketChange] = useState([0]);

  const scenarios = [
    { label: "Crash majeur", value: -30, color: "text-red-500" },
    { label: "Correction", value: -15, color: "text-orange-500" },
    { label: "Stagnation", value: 0, color: "text-slate-400" },
    { label: "Croissance", value: 15, color: "text-green-500" },
    { label: "Bull run", value: 30, color: "text-emerald-500" }
  ];

  const calculateScenario = (change) => {
    const newValue = currentValue * (1 + change / 100);
    const delta = newValue - currentValue;
    return { newValue, delta };
  };

  const { newValue, delta } = calculateScenario(marketChange[0]);

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          Simulateur de Scénarios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-slate-300 mb-4 block">
            Variation du marché: {marketChange[0] > 0 ? '+' : ''}{marketChange[0]}%
          </Label>
          <Slider
            value={marketChange}
            onValueChange={setMarketChange}
            min={-50}
            max={50}
            step={5}
            className="mb-4"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>-50%</span>
            <span>0%</span>
            <span>+50%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-xs text-slate-400 mb-1">Valeur actuelle</div>
            <div className="text-2xl font-bold text-white">
              {currentValue.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} €
            </div>
          </div>
          <div className={`bg-slate-800/50 rounded-lg p-4 ${delta >= 0 ? 'border-2 border-green-500/30' : 'border-2 border-red-500/30'}`}>
            <div className="text-xs text-slate-400 mb-1">Valeur simulée</div>
            <div className={`text-2xl font-bold ${delta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {newValue.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} €
            </div>
            <div className={`text-sm flex items-center gap-1 mt-1 ${delta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {delta >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {delta >= 0 ? '+' : ''}{delta.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} €
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Scénarios pré-définis</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {scenarios.map((scenario) => (
              <Button
                key={scenario.label}
                variant="outline"
                size="sm"
                onClick={() => setMarketChange([scenario.value])}
                className={`${scenario.color} border-slate-700 hover:bg-slate-800`}
              >
                {scenario.label}
                <br />
                <span className="text-xs">{scenario.value > 0 ? '+' : ''}{scenario.value}%</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">Impact par classe d'actif</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">Actions (volatilité x1.2)</span>
              <span className="text-white font-semibold">
                {(marketChange[0] * 1.2).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Crypto (volatilité x2)</span>
              <span className="text-white font-semibold">
                {(marketChange[0] * 2).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Obligations (volatilité x0.5)</span>
              <span className="text-white font-semibold">
                {(marketChange[0] * 0.5).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}