import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PortfolioOverview from "../components/dashboard/PortfolioOverview";
import AssetAllocation from "../components/dashboard/AssetAllocation";
import RecentAssets from "../components/dashboard/RecentAssets";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import AdvancedMetrics from "../components/dashboard/AdvancedMetrics";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const { data: assets = [], isLoading: assetsLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: () => base44.entities.Asset.list('-created_date'),
    initialData: [],
  });

  useEffect(() => {
    if (!assetsLoading) {
      setIsLoading(false);
    }
  }, [assetsLoading]);

  const portfolioStats = React.useMemo(() => {
    let totalValue = 0;
    let totalInvested = 0;

    assets.forEach(asset => {
      const currentValue = asset.quantity * (asset.current_price || asset.purchase_price);
      const investedValue = asset.quantity * asset.purchase_price;
      totalValue += currentValue;
      totalInvested += investedValue;
    });

    const profitLoss = totalValue - totalInvested;
    const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

    return {
      totalValue,
      totalInvested,
      profitLoss,
      profitLossPercentage,
      assetCount: assets.length
    };
  }, [assets]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Tableau de Bord
            </h1>
            <p className="text-slate-400 text-lg">
              Vue d'ensemble de votre portefeuille multi-actifs
            </p>
          </div>
          <Link to={createPageUrl("Assets")}>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg">
              <Plus className="w-5 h-5 mr-2" />
              Nouvel Actif
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <PortfolioOverview
            totalValue={portfolioStats.totalValue}
            totalInvested={portfolioStats.totalInvested}
            profitLoss={portfolioStats.profitLoss}
            profitLossPercentage={portfolioStats.profitLossPercentage}
            assetCount={portfolioStats.assetCount}
          />

          <PerformanceChart />
          
          <AdvancedMetrics assets={assets} />

          <div className="grid lg:grid-cols-2 gap-6">
            <AssetAllocation assets={assets} />
            <RecentAssets assets={assets} />
          </div>
        </div>
      </div>
    </div>
  );
}