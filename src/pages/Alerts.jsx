import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import AlertForm from "../components/alerts/AlertForm";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Alerts() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => base44.entities.PriceAlert.list('-created_date'),
    initialData: [],
  });

  const createAlertMutation = useMutation({
    mutationFn: (alertData) => base44.entities.PriceAlert.create(alertData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      setShowForm(false);
    },
  });

  const deleteAlertMutation = useMutation({
    mutationFn: (id) => base44.entities.PriceAlert.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  const handleSubmit = async (alertData) => {
    createAlertMutation.mutate(alertData);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette alerte ?")) {
      deleteAlertMutation.mutate(id);
    }
  };

  const activeAlerts = alerts.filter(a => !a.triggered);
  const triggeredAlerts = alerts.filter(a => a.triggered);

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
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Alertes de Prix
            </h1>
            <p className="text-slate-400 text-lg">
              Soyez notifié quand vos actifs atteignent un prix cible
            </p>
          </div>
          {!showForm && (
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle Alerte
            </Button>
          )}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <AlertForm
                onSubmit={handleSubmit}
                onCancel={() => setShowForm(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Bell className="w-6 h-6 text-indigo-400" />
              Alertes Actives ({activeAlerts.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-indigo-500/30 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white text-lg">{alert.asset_name}</h3>
                          <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs mt-1">
                            {alert.asset_type}
                          </Badge>
                        </div>
                        {alert.condition === 'above' ? (
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-400" />
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Condition:</span>
                          <span className="text-white">
                            {alert.condition === 'above' ? 'Au-dessus de' : 'En-dessous de'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Prix cible:</span>
                          <span className="text-indigo-400 font-semibold">
                            {alert.target_price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                          </span>
                        </div>
                        {alert.current_price && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Prix actuel:</span>
                            <span className="text-white font-semibold">
                              {alert.current_price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                            </span>
                          </div>
                        )}
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleDelete(alert.id)}
                      >
                        Supprimer
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {activeAlerts.length === 0 && (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-12 text-center">
                  <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Aucune alerte active</p>
                  <p className="text-slate-500 text-sm mt-2">
                    Créez votre première alerte pour être notifié des mouvements de prix
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {triggeredAlerts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-green-400" />
                Alertes Déclenchées ({triggeredAlerts.length})
              </h2>
              <div className="space-y-3">
                {triggeredAlerts.map((alert) => (
                  <Card key={alert.id} className="bg-green-500/10 border-green-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {alert.condition === 'above' ? (
                            <TrendingUp className="w-5 h-5 text-green-400" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-green-400" />
                          )}
                          <div>
                            <h3 className="font-semibold text-white">{alert.asset_name}</h3>
                            <p className="text-sm text-green-400">
                              {alert.condition === 'above' ? 'A dépassé' : 'Est tombé sous'} {alert.target_price.toLocaleString('fr-FR')} €
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">
                            {alert.triggered_date && format(new Date(alert.triggered_date), 'dd MMM yyyy', { locale: fr })}
                          </p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-400 hover:text-red-300"
                            onClick={() => handleDelete(alert.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}