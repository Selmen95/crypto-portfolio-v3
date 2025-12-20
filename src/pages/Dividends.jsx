import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Plus, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { format, isBefore, isAfter, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";

export default function Dividends() {
  const { data: dividends = [], isLoading } = useQuery({
    queryKey: ['dividends'],
    queryFn: () => base44.entities.Dividend.list('payment_date'),
    initialData: [],
  });

  const today = startOfDay(new Date());
  
  const upcomingDividends = dividends.filter(d => 
    d.status === 'upcoming' && isAfter(new Date(d.payment_date), today)
  );
  
  const receivedDividends = dividends.filter(d => d.status === 'received');
  
  const totalUpcoming = upcomingDividends.reduce((sum, d) => sum + d.amount, 0);
  const totalReceived = receivedDividends.reduce((sum, d) => sum + d.amount, 0);

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
              Calendrier des Dividendes
            </h1>
            <p className="text-slate-400 text-lg">
              Suivez vos revenus passifs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-8 h-8 text-green-400" />
                <span className="text-slate-300">Dividendes à venir</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {totalUpcoming.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </div>
              <p className="text-sm text-green-400 mt-1">{upcomingDividends.length} paiements prévus</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-8 h-8 text-blue-400" />
                <span className="text-slate-300">Dividendes reçus</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {totalReceived.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </div>
              <p className="text-sm text-blue-400 mt-1">{receivedDividends.length} paiements</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-8 h-8 text-purple-400" />
                <span className="text-slate-300">Rendement annuel</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {((totalReceived / 10000) * 100).toFixed(2)}%
              </div>
              <p className="text-sm text-purple-400 mt-1">Estimation</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-400" />
              Prochains Dividendes
            </h2>
            <div className="space-y-3">
              {upcomingDividends.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Aucun dividende à venir</p>
                  </CardContent>
                </Card>
              ) : (
                upcomingDividends.map((div) => (
                  <Card key={div.id} className="bg-slate-900/50 border-slate-800 hover:border-indigo-500/30 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg">{div.asset_name}</h3>
                            <p className="text-sm text-slate-400">
                              Paiement le {format(new Date(div.payment_date), 'dd MMMM yyyy', { locale: fr })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">
                            {div.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                          </div>
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            À venir
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {receivedDividends.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-400" />
                Historique
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {receivedDividends.slice(0, 6).map((div) => (
                  <Card key={div.id} className="bg-blue-500/10 border-blue-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">{div.asset_name}</h4>
                          <p className="text-xs text-slate-400">
                            {format(new Date(div.payment_date), 'dd MMM yyyy', { locale: fr })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-400">
                            {div.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                          </div>
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