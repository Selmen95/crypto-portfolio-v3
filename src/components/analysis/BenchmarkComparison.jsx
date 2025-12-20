import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function BenchmarkComparison({ portfolioPerformance = 12.5 }) {
  // Données de benchmark simulées
  const benchmarks = [
    { name: "Votre Portfolio", value: portfolioPerformance, color: "#6366f1" },
    { name: "CAC 40", value: 8.3, color: "#22c55e" },
    { name: "S&P 500", value: 15.2, color: "#f59e0b" },
    { name: "Bitcoin", value: 45.7, color: "#ec4899" },
    { name: "Or", value: 3.1, color: "#eab308" }
  ];

  // Données de performance sur 12 mois
  const performanceData = Array.from({ length: 12 }, (_, i) => ({
    month: `M${i + 1}`,
    portfolio: 100 + (portfolioPerformance * (i + 1) / 12),
    cac40: 100 + (8.3 * (i + 1) / 12),
    sp500: 100 + (15.2 * (i + 1) / 12),
    bitcoin: 100 + (45.7 * (i + 1) / 12),
    gold: 100 + (3.1 * (i + 1) / 12)
  }));

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          Comparaison avec les Benchmarks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {benchmarks.map((benchmark) => (
            <div key={benchmark.name} className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">{benchmark.name}</div>
              <div className="flex items-center gap-2">
                <div className="text-xl font-bold text-white">
                  {benchmark.value > 0 ? '+' : ''}{benchmark.value.toFixed(1)}%
                </div>
                {benchmark.value > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Performance sur 12 mois (base 100)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="portfolio" stroke="#6366f1" strokeWidth={2} name="Votre Portfolio" />
              <Line type="monotone" dataKey="cac40" stroke="#22c55e" strokeWidth={2} name="CAC 40" />
              <Line type="monotone" dataKey="sp500" stroke="#f59e0b" strokeWidth={2} name="S&P 500" />
              <Line type="monotone" dataKey="bitcoin" stroke="#ec4899" strokeWidth={2} name="Bitcoin" />
              <Line type="monotone" dataKey="gold" stroke="#eab308" strokeWidth={2} name="Or" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
          <p className="text-sm text-indigo-300">
            💡 Votre portefeuille {portfolioPerformance > 8.3 ? 'surperforme' : 'sous-performe'} le CAC 40 de {Math.abs(portfolioPerformance - 8.3).toFixed(1)} points.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}