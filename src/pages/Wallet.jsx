import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet as WalletIcon, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function Wallet() {
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: () => base44.entities.Asset.list('-created_date'),
    initialData: [],
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 10),
    initialData: [],
  });

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

    return {
      totalValue,
      totalInvested,
      profitLoss,
    };
  }, [assets]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Chargement...</p>
        </div>
      </div>
    );
  }

  const isProfitable = portfolioStats.profitLoss >= 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Portefeuille
          </h1>
          <p className="text-slate-400 text-lg">
            Vue d'ensemble de vos investissements
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Valeur Totale</CardTitle>
              <WalletIcon className="w-5 h-5 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                ${portfolioStats.totalValue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Capital Investi</CardTitle>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                ${portfolioStats.totalInvested.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-slate-900/50 border-slate-800 backdrop-blur-sm`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Profit/Perte</CardTitle>
              {isProfitable ? (
                <ArrowUpRight className="w-5 h-5 text-green-400" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-red-400" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                {isProfitable ? '+' : ''}${portfolioStats.profitLoss.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Mes Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              {assets.length > 0 ? (
                <div className="space-y-3">
                  {assets.slice(0, 5).map((asset) => {
                    const currentValue = asset.quantity * (asset.current_price || asset.purchase_price);
                    return (
                      <div key={asset.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                        <div>
                          <div className="font-medium text-white">{asset.name}</div>
                          <div className="text-sm text-slate-400">{asset.quantity} unités</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-white">
                            ${currentValue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  Aucun actif dans votre portefeuille
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Transactions Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{tx.asset_name}</div>
                        <div className="text-sm text-slate-400">
                          {tx.transaction_type === 'buy' ? 'Achat' : 'Vente'} - {tx.quantity} unités
                        </div>
                      </div>
                      <div className={`font-semibold ${tx.transaction_type === 'buy' ? 'text-red-400' : 'text-green-400'}`}>
                        {tx.transaction_type === 'buy' ? '-' : '+'}${tx.total_amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  Aucune transaction
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}