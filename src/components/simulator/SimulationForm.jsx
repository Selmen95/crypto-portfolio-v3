import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function SimulationForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    asset_type: "stock",
    initial_investment: 0,
    target_price: 0,
    stop_loss: 0,
    notes: ""
  });
  const [isSearching, setIsSearching] = useState(false);

  const { data: assets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: () => base44.entities.Asset.list('-created_date'),
    initialData: [],
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectAsset = (assetId) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      setFormData(prev => ({
        ...prev,
        name: `Simulation ${asset.name}`,
        symbol: asset.symbol || asset.name,
        asset_type: asset.asset_type === 'stock' || asset.asset_type === 'crypto' || asset.asset_type === 'etf' ? asset.asset_type : 'stock'
      }));
    }
  };

  const fetchCurrentPrice = async () => {
    if (!formData.symbol) return;
    
    setIsSearching(true);
    try {
      const prompt = `Donne-moi le prix actuel en temps réel de ${formData.symbol} (${formData.asset_type}). Réponds UNIQUEMENT avec le prix sous forme de nombre décimal, sans texte supplémentaire. Exemple: 150.25`;
      
      const priceStr = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true
      });

      const entryPrice = parseFloat(priceStr.trim());
      
      if (!isNaN(entryPrice)) {
        const quantity = formData.initial_investment / entryPrice;
        handleChange('entry_price', entryPrice);
        handleChange('current_price', entryPrice);
        handleChange('quantity', quantity);
        handleChange('current_value', formData.initial_investment);
        handleChange('profit_loss', 0);
      }
    } catch (error) {
      console.error("Error fetching price:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Nouvelle Simulation d'Investissement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Nom de la simulation *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ex: Tesla Q1 2024"
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Type d'actif</Label>
              <Select value={formData.asset_type} onValueChange={(value) => handleChange("asset_type", value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">Action</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="etf">ETF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Choisir un actif existant</Label>
            <Select onValueChange={handleSelectAsset}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Sélectionner un actif de votre portefeuille" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.name} {asset.symbol ? `(${asset.symbol})` : ''} - {asset.asset_type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Symbole (Ticker) *</Label>
            <div className="flex gap-2">
              <Input
                value={formData.symbol}
                onChange={(e) => handleChange("symbol", e.target.value.toUpperCase())}
                placeholder="AAPL, MSFT, BTC-USD, ETH-USD..."
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
              <Button
                type="button"
                onClick={fetchCurrentPrice}
                disabled={!formData.symbol || isSearching}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Recherche...
                  </>
                ) : (
                  "Obtenir le prix"
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Investissement (€) *</Label>
              <Input
                type="number"
                value={formData.initial_investment}
                onChange={(e) => handleChange("initial_investment", parseFloat(e.target.value))}
                placeholder="1000"
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Prix cible (€)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.target_price}
                onChange={(e) => handleChange("target_price", parseFloat(e.target.value))}
                placeholder="200"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Stop loss (€)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.stop_loss}
                onChange={(e) => handleChange("stop_loss", parseFloat(e.target.value))}
                placeholder="80"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Stratégie, objectifs..."
              className="bg-slate-800 border-slate-700 text-white"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              Créer la simulation
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}