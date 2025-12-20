import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ASSET_TYPES = [
  { value: "stock", label: "Action" },
  { value: "crypto", label: "Crypto" },
  { value: "real_estate", label: "Immobilier" },
  { value: "commodity", label: "Matière Première" },
  { value: "bond", label: "Obligation" },
  { value: "etf", label: "ETF" },
  { value: "other", label: "Autre" }
];

export default function AlertForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    asset_name: "",
    asset_type: "stock",
    condition: "above",
    target_price: 0,
    current_price: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Nouvelle Alerte de Prix</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Nom de l'actif *</Label>
              <Input
                value={formData.asset_name}
                onChange={(e) => handleChange("asset_name", e.target.value)}
                placeholder="Ex: Apple, Bitcoin..."
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
                  {ASSET_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Condition</Label>
              <Select value={formData.condition} onValueChange={(value) => handleChange("condition", value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Au-dessus de</SelectItem>
                  <SelectItem value="below">En-dessous de</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Prix cible (€) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.target_price}
                onChange={(e) => handleChange("target_price", parseFloat(e.target.value))}
                placeholder="100.00"
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Prix actuel (€)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.current_price}
                onChange={(e) => handleChange("current_price", parseFloat(e.target.value))}
                placeholder="95.00"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              Créer l'alerte
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}