import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DiversificationScore({ assets = [] }) {
  // Calcul du score de diversification
  const calculateDiversification = () => {
    if (assets.length === 0) return { score: 0, level: "none", recommendations: [] };

    const totalValue = assets.reduce((sum, a) => sum + (a.quantity * (a.current_price || a.purchase_price)), 0);
    
    // Distribution par type
    const typeDistribution = {};
    assets.forEach(asset => {
      const value = asset.quantity * (asset.current_price || asset.purchase_price);
      typeDistribution[asset.asset_type] = (typeDistribution[asset.asset_type] || 0) + value;
    });

    const types = Object.keys(typeDistribution);
    const maxConcentration = Math.max(...Object.values(typeDistribution)) / totalValue;
    
    // Score basé sur nombre de types et concentration
    let score = 0;
    score += types.length * 15; // Points pour diversité
    score -= maxConcentration * 50; // Pénalité pour concentration
    score += assets.length * 2; // Points pour nombre d'actifs
    score = Math.max(0, Math.min(100, score));

    let level = "faible";
    let icon = AlertTriangle;
    let color = "text-red-400";
    
    if (score >= 70) {
      level = "excellent";
      icon = CheckCircle;
      color = "text-green-400";
    } else if (score >= 50) {
      level = "bon";
      icon = Shield;
      color = "text-yellow-400";
    }

    // Recommandations
    const recommendations = [];
    if (types.length < 3) recommendations.push("Diversifiez dans plus de classes d'actifs");
    if (maxConcentration > 0.5) recommendations.push("Réduisez la concentration de votre actif principal");
    if (assets.length < 5) recommendations.push("Augmentez le nombre d'actifs dans votre portefeuille");
    if (recommendations.length === 0) recommendations.push("Votre portefeuille est bien diversifié !");

    return { score, level, icon, color, recommendations, typeDistribution, totalValue };
  };

  const { score, level, icon: Icon, color, recommendations, typeDistribution, totalValue } = calculateDiversification();

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          Score de Diversification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className={`text-6xl font-bold ${color} mb-2`}>{score.toFixed(0)}</div>
          <Badge className={color}>{level.toUpperCase()}</Badge>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Niveau de diversification</span>
            <span className="text-white font-semibold">{score.toFixed(0)}%</span>
          </div>
          <Progress value={score} className="h-3" />
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Icon className={`w-4 h-4 ${color}`} />
            Répartition par type
          </h4>
          <div className="space-y-2">
            {Object.entries(typeDistribution || {}).map(([type, value]) => {
              const percentage = ((value / totalValue) * 100).toFixed(1);
              return (
                <div key={type} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 capitalize">{type}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={parseFloat(percentage)} className="w-24 h-2" />
                    <span className="text-white font-semibold w-12 text-right">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">Recommandations</h4>
          <ul className="space-y-1">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-indigo-400">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}