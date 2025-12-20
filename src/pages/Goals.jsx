import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, Home, Plane, GraduationCap, Wallet, Calendar, CheckCircle, TrendingUp } from "lucide-react";
import GoalForm from "../components/goals/GoalForm";
import { AnimatePresence, motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

const GOAL_ICONS = {
  retirement: Wallet,
  house: Home,
  vacation: Plane,
  education: GraduationCap,
  emergency: Target,
  other: Target
};

const GOAL_COLORS = {
  retirement: "from-purple-500 to-indigo-500",
  house: "from-blue-500 to-cyan-500",
  vacation: "from-orange-500 to-pink-500",
  education: "from-green-500 to-emerald-500",
  emergency: "from-red-500 to-rose-500",
  other: "from-slate-500 to-gray-500"
};

export default function Goals() {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: () => base44.entities.Goal.list('-created_date'),
    initialData: [],
  });

  const createGoalMutation = useMutation({
    mutationFn: (goalData) => base44.entities.Goal.create(goalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setShowForm(false);
      setEditingGoal(null);
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, goalData }) => base44.entities.Goal.update(id, goalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setShowForm(false);
      setEditingGoal(null);
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (id) => base44.entities.Goal.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const handleSubmit = async (goalData) => {
    if (editingGoal) {
      updateGoalMutation.mutate({ id: editingGoal.id, goalData });
    } else {
      createGoalMutation.mutate(goalData);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet objectif ?")) {
      deleteGoalMutation.mutate(id);
    }
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

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
              Mes Objectifs Financiers
            </h1>
            <p className="text-slate-400 text-lg">
              Définissez et suivez vos objectifs d'investissement
            </p>
          </div>
          {!showForm && (
            <Button 
              onClick={() => {
                setEditingGoal(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvel Objectif
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
              <GoalForm
                goal={editingGoal}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingGoal(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeGoals.map((goal) => {
              const IconComponent = GOAL_ICONS[goal.category];
              const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
              const daysLeft = differenceInDays(new Date(goal.target_date), new Date());
              const remaining = goal.target_amount - goal.current_amount;

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-indigo-500/30 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-r ${GOAL_COLORS[goal.category]} rounded-xl flex items-center justify-center shadow-lg`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-white text-xl">{goal.title}</CardTitle>
                            {goal.description && (
                              <p className="text-slate-400 text-sm mt-1">{goal.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(goal)}>
                            Modifier
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-400" onClick={() => handleDelete(goal.id)}>
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Progression</span>
                            <span className="text-white font-semibold">{progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={progress} className="h-3" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-800/50 rounded-lg p-3">
                            <div className="text-xs text-slate-400 mb-1">Actuel</div>
                            <div className="text-lg font-bold text-white">
                              {goal.current_amount.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} €
                            </div>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-3">
                            <div className="text-xs text-slate-400 mb-1">Objectif</div>
                            <div className="text-lg font-bold text-white">
                              {goal.target_amount.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} €
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">
                              {daysLeft > 0 ? `${daysLeft} jours restants` : 'Date dépassée'}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-slate-400">Reste: </span>
                            <span className="text-indigo-400 font-semibold">
                              {remaining.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} €
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {completedGoals.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Objectifs Atteints
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedGoals.map((goal) => {
                  const IconComponent = GOAL_ICONS[goal.category];
                  return (
                    <Card key={goal.id} className="bg-green-500/10 border-green-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-green-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{goal.title}</h3>
                            <p className="text-sm text-green-400">
                              {goal.target_amount.toLocaleString('fr-FR')} € atteint
                            </p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}