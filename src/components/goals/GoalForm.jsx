import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Plane, GraduationCap, Wallet, Target } from "lucide-react";

const GOAL_CATEGORIES = [
  { value: "retirement", label: "Retraite", icon: Wallet },
  { value: "house", label: "Immobilier", icon: Home },
  { value: "vacation", label: "Vacances", icon: Plane },
  { value: "education", label: "Éducation", icon: GraduationCap },
  { value: "emergency", label: "Fonds d'urgence", icon: Target },
  { value: "other", label: "Autre", icon: Target }
];

export default function GoalForm({ goal, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(goal || {
    title: "",
    description: "",
    target_amount: 0,
    current_amount: 0,
    target_date: "",
    category: "other",
    status: "active"
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
        <CardTitle className="text-white">
          {goal ? "Modifier l'objectif" : "Nouvel Objectif Financier"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Titre *</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Ex: Acheter une maison"
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Catégorie</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <cat.icon className="w-4 h-4" />
                        {cat.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Détails sur votre objectif..."
              className="bg-slate-800 border-slate-700 text-white"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Montant cible (€) *</Label>
              <Input
                type="number"
                value={formData.target_amount}
                onChange={(e) => handleChange("target_amount", parseFloat(e.target.value))}
                placeholder="50000"
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Montant actuel (€)</Label>
              <Input
                type="number"
                value={formData.current_amount}
                onChange={(e) => handleChange("current_amount", parseFloat(e.target.value))}
                placeholder="0"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Date cible *</Label>
              <Input
                type="date"
                value={formData.target_date}
                onChange={(e) => handleChange("target_date", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              {goal ? "Mettre à jour" : "Créer l'objectif"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}