import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Edit, Trash2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function AssetsList({ assets, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const filteredAndSortedAssets = React.useMemo(() => {
    let filtered = assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (asset.symbol && asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === "all" || asset.asset_type === filterType;
      return matchesSearch && matchesType;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "value":
          const valueA = a.quantity * (a.current_price || a.purchase_price);
          const valueB = b.quantity * (b.current_price || b.purchase_price);
          return valueB - valueA;
        case "performance":
          const perfA = ((a.current_price || a.purchase_price) - a.purchase_price) / a.purchase_price;
          const perfB = ((b.current_price || b.purchase_price) - b.purchase_price) / b.purchase_price;
          return perfB - perfA;
        default:
          return 0;
      }
    });
  }, [assets, searchTerm, filterType, sortBy]);

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Mes Actifs</CardTitle>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher un actif..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="stock">Actions</SelectItem>
              <SelectItem value="crypto">Crypto</SelectItem>
              <SelectItem value="real_estate">Immobilier</SelectItem>
              <SelectItem value="commodity">Matières Premières</SelectItem>
              <SelectItem value="bond">Obligations</SelectItem>
              <SelectItem value="etf">ETF</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom</SelectItem>
              <SelectItem value="value">Valeur</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <AnimatePresence>
          {filteredAndSortedAssets.length > 0 ? (
            <div className="space-y-3">
              {filteredAndSortedAssets.map((asset, index) => {
                const currentValue = asset.quantity * (asset.current_price || asset.purchase_price);
                const investedValue = asset.quantity * asset.purchase_price;
                const profitLoss = currentValue - investedValue;
                const profitLossPercentage = (profitLoss / investedValue) * 100;
                const isProfitable = profitLoss >= 0;

                return (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all gap-4"
                  >
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold text-lg">{asset.name}</span>
                            {asset.symbol && (
                              <span className="text-slate-400 text-sm">({asset.symbol})</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={ASSET_TYPE_COLORS[asset.asset_type]}>
                              {ASSET_TYPE_LABELS[asset.asset_type]}
                            </Badge>
                            {asset.broker && (
                              <span className="text-xs text-slate-500">{asset.broker}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>{asset.quantity} × ${(asset.current_price || asset.purchase_price).toFixed(2)}</span>
                        {asset.location && (
                          <span className="flex items-center gap-1">📍 {asset.location}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-white font-semibold text-lg">
                          ${currentValue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className={`flex items-center gap-1 justify-end text-sm ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                          {isProfitable ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>{isProfitable ? '+' : ''}{profitLossPercentage.toFixed(2)}%</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(asset)}
                          className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(asset.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p>Aucun actif trouvé</p>
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}