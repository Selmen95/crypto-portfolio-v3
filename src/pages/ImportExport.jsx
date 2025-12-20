import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ImportCSV from "../components/import-export/ImportCSV";
import ExportPDF from "../components/import-export/ExportPDF";
import { ArrowDownUp } from "lucide-react";

export default function ImportExport() {
  const queryClient = useQueryClient();

  const { data: assets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: () => base44.entities.Asset.list('-created_date'),
    initialData: [],
  });

  const totalValue = assets.reduce((sum, a) => sum + (a.quantity * (a.current_price || a.purchase_price)), 0);
  const totalInvested = assets.reduce((sum, a) => sum + (a.quantity * a.purchase_price), 0);
  const profitLoss = totalValue - totalInvested;
  const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

  const portfolioStats = {
    totalValue,
    totalInvested,
    profitLoss,
    profitLossPercentage
  };

  const handleImportComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['assets'] });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
            <ArrowDownUp className="w-10 h-10 text-indigo-400" />
            Import & Export
          </h1>
          <p className="text-slate-400 text-lg">
            Gérez vos données facilement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImportCSV onImportComplete={handleImportComplete} />
          <ExportPDF assets={assets} portfolioStats={portfolioStats} />
        </div>
      </div>
    </div>
  );
}