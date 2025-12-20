import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, RefreshCw, Trash2, Target, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function SimulationCard({ simulation, onDelete, onUpdatePrice }) {
  const profitLoss = simulation.profit_loss || 0;
  const profitLossPercentage = simulation.initial_investment > 0 
    ? (profitLoss / simulation.initial_investment) * 100 
    : 0;

  const currentPrice = simulation.current_price || simulation.entry_price;
  const isProfitable = profitLoss >= 0;

  // Calcul de la progression vers l'objectif
  const targetProgress = simulation.target_price && simulation.entry_price
    ? Math.min(((currentPrice - simulation.entry_price) / (simulation.target_price - simulation.entry_price)) * 100, 100)
    : 0;

  // Vérification du stop loss
  const isNearStopLoss = simulation.stop_loss && currentPrice <= simulation.stop_loss * 1.05;

  return (
    <Card className={`bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-indigo-500/30 transition-all ${
      isNearStopLoss ? 'border-red-500/50' : ''
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-white text-xl flex items-center gap-2">
              {simulation.name}
              <Badge variant="outline" className="text-xs">
                {simulation.symbol}
              </Badge>
            </CardTitle>
            <p className="text-slate-400 text-sm mt-1">{simulation.asset_type}</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onUpdatePrice}
              className="text-indigo-400 hover:text-indigo-300"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onDelete}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isNearStopLoss && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-sm text-red-400">Prix proche du stop loss !</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">Investissement</div>
            <div className="text-lg font-bold text-white">
              {simulation.initial_investment.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} €
            </div>
          </div>
          <div className={`bg-slate-800/50 rounded-lg p-3 ${isProfitable ? 'border-2 border-green-500/30' : 'border-2 border-red-500/30'}`}>
            <div className="text-xs text-slate-400 mb-1">Valeur actuelle</div>
            <div className={`text-lg font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
              {(simulation.current_value || simulation.initial_investment).toLocaleString('fr-FR', { minimumFractionDigits: 0 })} €
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Profit / Perte</span>
            <div className="flex items-center gap-2">
              {isProfitable ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
              <span className={`text-lg font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                {isProfitable ? '+' : ''}{profitLoss.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Performance</span>
            <span className={`text-sm font-semibold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
              {isProfitable ? '+' : ''}{profitLossPercentage.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Prix d'entrée</span>
            <span className="text-white font-semibold">
              {simulation.entry_price?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || 'N/A'} €
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Prix actuel</span>
            <span className="text-indigo-400 font-semibold">
              {currentPrice?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || 'N/A'} €
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Quantité</span>
            <span className="text-white font-semibold">
              {simulation.quantity?.toFixed(4) || 'N/A'}
            </span>
          </div>
        </div>

        {simulation.target_price && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400 flex items-center gap-1">
                <Target className="w-4 h-4" />
                Objectif
              </span>
              <span className="text-green-400 font-semibold">
                {simulation.target_price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </span>
            </div>
            <Progress value={targetProgress > 0 ? targetProgress : 0} className="h-2" />
            <div className="text-xs text-slate-400 text-right">
              {targetProgress > 0 ? targetProgress.toFixed(1) : 0}% de l'objectif
            </div>
          </div>
        )}

        {simulation.notes && (
          <div className="bg-slate-800/30 rounded-lg p-3">
            <p className="text-sm text-slate-300">{simulation.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}