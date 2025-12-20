import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import DiversificationScore from "../components/analysis/DiversificationScore";
import BenchmarkComparison from "../components/analysis/BenchmarkComparison";
import ScenarioSimulator from "../components/analysis/ScenarioSimulator";
import AIRecommendations from "../components/analysis/AIRecommendations";
import { BarChart3 } from "lucide-react";

export default function Analysis() {
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: () => base44.entities.Asset.list('-created_date'),
    initialData: [],
  });

  const totalValue = assets.reduce((sum, a) => sum + (a.quantity * (a.current_price || a.purchase_price)), 0);
  const totalInvested = assets.reduce((sum, a) => sum + (a.quantity * a.purchase_price), 0);
  const profitLoss = totalValue - totalInvested;
  const performance = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Chargement de l'analyse...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-indigo-400" />
            Analyse Approfondie
          </h1>
          <p className="text-slate-400 text-lg">
            Insights et recommandations pour optimiser votre portefeuille
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DiversificationScore assets={assets} />
            <ScenarioSimulator currentValue={totalValue} assets={assets} />
          </div>

          <BenchmarkComparison portfolioPerformance={performance} />

          <AIRecommendations assets={assets} riskProfile="moderate" />
        </div>
      </div>
    </div>
  );
}