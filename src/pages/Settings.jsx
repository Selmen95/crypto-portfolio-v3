import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Settings() {
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const currentUser = await base44.auth.me();
      setPreferences(currentUser);
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!preferences) return;

    setIsSaving(true);
    try {
      await base44.auth.updateMe(preferences);
      setSaveMessage("Paramètres enregistrés avec succès !");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Error saving preferences:", error);
      setSaveMessage("Erreur lors de l'enregistrement.");
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-indigo-400" />
            Paramètres
          </h1>
          <p className="text-slate-400 text-lg">
            Gérez vos préférences et informations de compte
          </p>
        </div>

        {saveMessage && (
          <Alert className="mb-6 bg-green-500/20 border-green-500/30">
            <AlertDescription className="text-green-400">
              {saveMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Information */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Informations du Profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Nom Complet</Label>
                <Input
                  type="text"
                  value={preferences?.full_name || ""}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white"
                  placeholder="Votre nom"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Email</Label>
                <Input
                  type="email"
                  value={preferences?.email || ""}
                  disabled
                  className="bg-slate-800 border-slate-600 text-slate-400"
                />
                <p className="text-sm text-slate-400">
                  L'email ne peut pas être modifié
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Notifications Email</Label>
                  <p className="text-sm text-slate-400">Recevoir des alertes par email</p>
                </div>
                <Switch
                  checked={preferences?.email_notifications || false}
                  onCheckedChange={(checked) => handleInputChange('email_notifications', checked)}
                  className="data-[state=checked]:bg-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Rapports Hebdomadaires</Label>
                  <p className="text-sm text-slate-400">Résumé de votre portefeuille</p>
                </div>
                <Switch
                  checked={preferences?.weekly_reports || false}
                  onCheckedChange={(checked) => handleInputChange('weekly_reports', checked)}
                  className="data-[state=checked]:bg-indigo-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Display Preferences */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Préférences d'Affichage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Devise par Défaut</Label>
                <Select
                  value={preferences?.default_currency || "USD"}
                  onValueChange={(value) => handleInputChange('default_currency', value)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Langue</Label>
                <Select
                  value={preferences?.language || "fr"}
                  onValueChange={(value) => handleInputChange('language', value)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">À propos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <div className="font-medium text-white">Version</div>
                  <div className="text-sm text-slate-400">AssetFlow v1.0.0</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <div className="font-medium text-white">Rôle</div>
                  <div className="text-sm text-slate-400">{preferences?.role || 'User'}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <div className="font-medium text-white">Membre depuis</div>
                  <div className="text-sm text-slate-400">
                    {preferences?.created_date ? new Date(preferences.created_date).toLocaleDateString('fr-FR') : '-'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </div>
  );
}