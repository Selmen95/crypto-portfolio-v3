import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const ASSET_TYPE_COLORS = {
  stock: "#6366f1",
  crypto: "#f59e0b",
  real_estate: "#10b981",
  commodity: "#ef4444",
  bond: "#8b5cf6",
  etf: "#06b6d4",
  other: "#64748b"
};

const ASSET_TYPE_LABELS = {
  stock: "Actions",
  crypto: "Crypto",
  real_estate: "Immobilier",
  commodity: "Matières Premières",
  bond: "Obligations",
  etf: "ETF",
  other: "Autre"
};

export default function AssetAllocation({ assets }) {
  const allocationData = React.useMemo(() => {
    const typeValues = {};
    
    assets.forEach(asset => {
      const value = asset.quantity * (asset.current_price || asset.purchase_price);
      if (!typeValues[asset.asset_type]) {
        typeValues[asset.asset_type] = 0;
      }
      typeValues[asset.asset_type] += value;
    });

    return Object.keys(typeValues).map(type => ({
      name: ASSET_TYPE_LABELS[type] || type,
      value: typeValues[type],
      color: ASSET_TYPE_COLORS[type] || "#64748b"
    }));
  }, [assets]);

  const totalValue = allocationData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Répartition par Type d'Actif</CardTitle>
      </CardHeader>
      <CardContent>
        {allocationData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `$${value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`}
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-6 space-y-3">
              {allocationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-200 font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      ${item.value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-slate-400">
                      {((item.value / totalValue) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <PieChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucun actif dans votre portefeuille</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}