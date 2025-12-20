import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Plus, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import SimulationForm from "../components/simulator/SimulationForm";
import SimulationCard from "../components/simulator/SimulationCard";
import { AnimatePresence, motion } from "framer-motion";

export default function Simulator() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: simulations = [], isLoading } = useQuery({
    queryKey: ['simulations'],
    queryFn: () => base44.entities.InvestmentSimulation.list('-created_date'),
    initialData: [],
  });

  const createSimulationMutation = useMutation({
    mutationFn: (data) => base44.entities.InvestmentSimulation.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
      setShowForm(false);
    },
  });

  const updateSimulationMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.InvestmentSimulation.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
    },
  });

  const deleteSimulationMutation = useMutation({
    mutationFn: (id) => base44.entities.InvestmentSimulation.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
    },
  });

  const handleSubmit = async (simData) => {
    createSimulationMutation.mutate(simData);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette simulation ?")) {
      deleteSimulationMutation.mutate(id);
    }
  };

  const handleUpdatePrice = async (simulation) => {
    try {
      const prompt = `Donne-moi le prix actuel en temps réel de ${simulation.symbol} (${simulation.asset_type}). Réponds UNIQUEMENT avec le prix sous forme de nombre décimal, sans texte supplémentaire. Exemple: 150.25`;
      
      const priceStr = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true
      });

      const currentPrice = parseFloat(priceStr.trim());
      
      if (!isNaN(currentPrice)) {
        const currentValue = simulation.quantity * currentPrice;
        const profitLoss = currentValue - simulation.initial_investment;
        
        await updateSimulationMutation.mutateAsync({
          id: simulation.id,
          data: {
            ...simulation,
            current_price: currentPrice,
            current_value: currentValue,
            profit_loss: profitLoss
          }
        });
      }
    } catch (error) {
      console.error("Error updating price:", error);
    }
  };

  const activeSimulations = simulations.filter(s => s.status === 'active');
  const totalInvested = activeSimulations.reduce((sum, s) => sum + s.initial_investment, 0);
  const totalValue = activeSimulations.reduce((sum, s) => sum + (s.current_value || s.initial_investment), 0);
  const totalPL = totalValue - totalInvested;

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
              Simulateur d'Investissement
            </h1>
            <p className="text-slate-400 text-lg">
              Simulez vos investissements avec les cours en temps réel
            </p>
          </div>
          {!showForm && (
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle Simulation
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-8 h-8 text-blue-400" />
                <span className="text-slate-300">Capital Simulé</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {totalInvested.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} €
              </div>
              <p className="text-sm text-blue-400 mt-1">{activeSimulations.length} simulations actives</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                <span className="text-slate-300">Valeur Actuelle</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {totalValue.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} €
              </div>
              <p className="text-sm text-purple-400 mt-1">Valeur du portefeuille simulé</p>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${totalPL >= 0 ? 'from-green-500/20 to-emerald-500/20 border-green-500/30' : 'from-red-500/20 to-rose-500/20 border-red-500/30'}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                {totalPL >= 0 ? (
                  <TrendingUp className="w-8 h-8 text-green-400" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-red-400" />
                )}
                <span className="text-slate-300">P&L Total</span>
              </div>
              <div className={`text-3xl font-bold ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPL >= 0 ? '+' : ''}{totalPL.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} €
              </div>
              <p className={`text-sm mt-1 ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalInvested > 0 ? `${((totalPL / totalInvested) * 100).toFixed(2)}%` : '0%'}
              </p>
            </CardContent>
          </Card>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <SimulationForm
                onSubmit={handleSubmit}
                onCancel={() => setShowForm(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {simulations.map((sim) => (
            <SimulationCard
              key={sim.id}
              simulation={sim}
              onDelete={() => handleDelete(sim.id)}
              onUpdatePrice={() => handleUpdatePrice(sim)}
            />
          ))}
        </div>

        {simulations.length === 0 && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-12 text-center">
              <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Aucune simulation</p>
              <p className="text-slate-500 text-sm mt-2">
                Créez votre première simulation pour tester vos stratégies
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}