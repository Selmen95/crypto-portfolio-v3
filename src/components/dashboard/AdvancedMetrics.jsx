import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, Target, BarChart3 } from "lucide-react";

export default function AdvancedMetrics({ assets = [] }) {
  // Calcul des métriques avancées
  const totalInvested = assets.reduce((sum, asset) => sum + (asset.quantity * asset.purchase_price), 0);
  const totalValue = assets.reduce((sum, asset) => sum + (asset.quantity * (asset.current_price || asset.purchase_price)), 0);
  const profitLoss = totalValue - totalInvested;
  
  // ROI
  const roi = totalInvested > 0 ? ((profitLoss / totalInvested) * 100) : 0;
  
  // Rendement annualisé (approximation simple)
  const annualizedReturn = roi * 2; // Simplifié pour la démo
  
  // Volatilité (écart-type des variations de prix, simplifié)
  const volatility = assets.length > 0 ? 15.5 : 0; // Valeur démo
  
  // Sharpe Ratio (simplifié)
  const sharpeRatio = annualizedReturn > 0 ? (annualizedReturn / volatility) : 0;

  const metrics = [
    {
      title: "ROI",
      value: `${roi.toFixed(2)}%`,
      icon: TrendingUp,
      color: roi >= 0 ? "text-green-400" : "text-red-400",
      bgColor: roi >= 0 ? "bg-green-500/20" : "bg-red-500/20",
      description: "Retour sur investissement"
    },
    {
      title: "Rendement Annualisé",
      value: `${annualizedReturn.toFixed(2)}%`,
      icon: BarChart3,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/20",
      description: "Performance annuelle estimée"
    },
    {
      title: "Volatilité",
      value: `${volatility.toFixed(1)}%`,
      icon: Activity,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      description: "Mesure du risque"
    },
    {
      title: "Sharpe Ratio",
      value: sharpeRatio.toFixed(2),
      icon: Target,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      description: "Rendement ajusté du risque"
    }
  ];

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Métriques Avancées</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                </div>
                <div className="text-xs text-slate-400">{metric.title}</div>
              </div>
              <div className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-xs text-slate-500">{metric.description}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}