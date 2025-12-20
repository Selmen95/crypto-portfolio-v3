import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

const ASSET_TYPE_LABELS = {
  stock: "Action",
  crypto: "Crypto",
  real_estate: "Immobilier",
  commodity: "Matière Première",
  bond: "Obligation",
  etf: "ETF",
  other: "Autre"
};

const ASSET_TYPE_COLORS = {
  stock: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  crypto: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  real_estate: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  commodity: "bg-red-500/20 text-red-300 border-red-500/30",
  bond: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  etf: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  other: "bg-slate-500/20 text-slate-300 border-slate-500/30"
};

export default function RecentAssets({ assets }) {
  const sortedAssets = [...assets].sort((a, b) => 
    new Date(b.created_date) - new Date(a.created_date)
  ).slice(0, 5);

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Actifs Récents</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedAssets.length > 0 ? (
          <div className="space-y-3">
            {sortedAssets.map((asset, index) => {
              const currentValue = asset.quantity * (asset.current_price || asset.purchase_price);
              const investedValue = asset.quantity * asset.purchase_price;
              const profitLoss = currentValue - investedValue;
              const profitLossPercentage = (profitLoss / investedValue) * 100;
              const isProfitable = profitLoss >= 0;

              return (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{asset.name}</span>
                        {asset.symbol && (
                          <span className="text-slate-400 text-sm">({asset.symbol})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={ASSET_TYPE_COLORS[asset.asset_type]}>
                          {ASSET_TYPE_LABELS[asset.asset_type]}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {asset.quantity} × ${asset.current_price?.toFixed(2) || asset.purchase_price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      ${currentValue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`flex items-center gap-1 justify-end text-sm ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                      {isProfitable ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{isProfitable ? '+' : ''}{profitLossPercentage.toFixed(2)}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <p>Aucun actif pour le moment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}