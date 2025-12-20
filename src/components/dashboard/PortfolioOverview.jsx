import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, PieChart } from "lucide-react";
import { motion } from "framer-motion";

export default function PortfolioOverview({ totalValue, totalInvested, profitLoss, profitLossPercentage, assetCount }) {
  const isProfitable = profitLoss >= 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border-indigo-500/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Valeur Totale</CardTitle>
            <Wallet className="w-5 h-5 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">
              ${totalValue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-400">Portefeuille global</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Investi</CardTitle>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">
              ${totalInvested.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-400">Capital initial</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className={`bg-gradient-to-br ${isProfitable ? 'from-green-500/10 via-emerald-500/5' : 'from-red-500/10 via-rose-500/5'} to-transparent border-${isProfitable ? 'green' : 'red'}-500/20 backdrop-blur-sm`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Profit / Perte</CardTitle>
            {isProfitable ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold mb-1 ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
              {isProfitable ? '+' : ''}{profitLoss.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $
            </div>
            <p className={`text-xs ${isProfitable ? 'text-green-400/70' : 'text-red-400/70'}`}>
              {isProfitable ? '+' : ''}{profitLossPercentage.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent border-violet-500/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Actifs</CardTitle>
            <PieChart className="w-5 h-5 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">
              {assetCount}
            </div>
            <p className="text-xs text-slate-400">Positions ouvertes</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}