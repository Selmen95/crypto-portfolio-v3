import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

const ASSET_TYPES = [
  { value: "stock", label: "Action" },
  { value: "crypto", label: "Cryptomonnaie" },
  { value: "real_estate", label: "Immobilier" },
  { value: "commodity", label: "Matière Première" },
  { value: "bond", label: "Obligation" },
  { value: "etf", label: "ETF" },
  { value: "other", label: "Autre" }
];

export default function AssetForm({ asset, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(asset || {
    name: "",
    symbol: "",
    asset_type: "stock",
    quantity: "",
    purchase_price: "",
    current_price: "",
    currency: "USD",
    purchase_date: "",
    notes: "",
    location: "",
    broker: ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-white">
          {asset ? "Modifier l'Actif" : "Nouvel Actif"}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">Nom de l'actif *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="ex: Apple Inc."
                required
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="symbol" className="text-slate-300">Symbole</Label>
              <Input
                id="symbol"
                value={formData.symbol}
                onChange={(e) => handleChange("symbol", e.target.value)}
                placeholder="ex: AAPL"
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset_type" className="text-slate-300">Type d'actif *</Label>
            <Select value={formData.asset_type} onValueChange={(value) => handleChange("asset_type", value)}>
              <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASSET_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-slate-300">Quantité *</Label>
              <Input
                id="quantity"
                type="number"
                step="any"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", parseFloat(e.target.value) || "")}
                placeholder="0"
                required
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase_price" className="text-slate-300">Prix d'achat *</Label>
              <Input
                id="purchase_price"
                type="number"
                step="any"
                value={formData.purchase_price}
                onChange={(e) => handleChange("purchase_price", parseFloat(e.target.value) || "")}
                placeholder="0.00"
                required
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_price" className="text-slate-300">Prix actuel</Label>
              <Input
                id="current_price"
                type="number"
                step="any"
                value={formData.current_price}
                onChange={(e) => handleChange("current_price", parseFloat(e.target.value) || "")}
                placeholder="0.00"
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchase_date" className="text-slate-300">Date d'achat</Label>
              <Input
                id="purchase_date"
                type="date"
                value={formData.purchase_date}
                onChange={(e) => handleChange("purchase_date", e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency" className="text-slate-300">Devise</Label>
              <Input
                id="currency"
                value={formData.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                placeholder="USD"
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
          </div>

          {formData.asset_type === "real_estate" && (
            <div className="space-y-2">
              <Label htmlFor="location" className="text-slate-300">Localisation</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="ex: Paris, France"
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="broker" className="text-slate-300">Courtier / Plateforme</Label>
            <Input
              id="broker"
              value={formData.broker}
              onChange={(e) => handleChange("broker", e.target.value)}
              placeholder="ex: Interactive Brokers"
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-slate-300">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Notes personnelles..."
              className="bg-slate-800/50 border-slate-700 text-white min-h-[100px]"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="border-slate-700 text-slate-300 hover:bg-slate-800">
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              {loading ? "Enregistrement..." : asset ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}