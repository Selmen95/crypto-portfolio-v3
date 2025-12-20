import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, TrendingUp, Shield, Target } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";

export default function AIRecommendations({ assets = [], riskProfile = "moderate" }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateRecommendations = async () => {
    setIsLoading(true);
    try {
      const portfolioSummary = assets.map(a => ({
        name: a.name,
        type: a.asset_type,
        value: a.quantity * (a.current_price || a.purchase_price)
      }));

      const prompt = `Tu es un conseiller financier expert. Analyse ce portefeuille et donne 3-5 recommandations concrètes et personnalisées.

Portefeuille: ${JSON.stringify(portfolioSummary)}
Profil de risque: ${riskProfile}

Réponds UNIQUEMENT avec un JSON dans ce format exact:
{
  "recommendations": [
    {
      "title": "Titre court",
      "description": "Description détaillée",
      "type": "diversification|risk|opportunity",
      "priority": "high|medium|low"
    }
  ]
}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  type: { type: "string" },
                  priority: { type: "string" }
                }
              }
            }
          }
        }
      });

      setRecommendations(response.recommendations || []);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setRecommendations([
        {
          title: "Diversifiez vos investissements",
          description: "Ajoutez des actifs de différentes classes pour réduire le risque global.",
          type: "diversification",
          priority: "high"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const typeIcons = {
    diversification: Shield,
    risk: Target,
    opportunity: TrendingUp
  };

  const typeColors = {
    diversification: "text-blue-400 bg-blue-500/20",
    risk: "text-red-400 bg-red-500/20",
    opportunity: "text-green-400 bg-green-500/20"
  };

  const priorityColors = {
    high: "border-red-500/50 bg-red-500/10",
    medium: "border-yellow-500/50 bg-yellow-500/10",
    low: "border-slate-500/50 bg-slate-500/10"
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Recommandations IA
          </CardTitle>
          <Button
            onClick={generateRecommendations}
            disabled={isLoading || assets.length === 0}
            className="bg-gradient-to-r from-indigo-500 to-purple-500"
            size="sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyse...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Générer
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">
              Cliquez sur "Générer" pour obtenir des recommandations personnalisées basées sur l'IA
            </p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 text-indigo-400 mx-auto mb-4 animate-spin" />
            <p className="text-slate-300">Analyse de votre portefeuille en cours...</p>
          </div>
        )}

        {recommendations.length > 0 && !isLoading && (
          <div className="space-y-4">
            {recommendations.map((rec, idx) => {
              const Icon = typeIcons[rec.type] || Target;
              return (
                <div
                  key={idx}
                  className={`border-2 rounded-lg p-4 ${priorityColors[rec.priority]}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[rec.type]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-semibold">{rec.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {rec.priority === 'high' ? 'Prioritaire' : rec.priority === 'medium' ? 'Important' : 'Suggestion'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-300">{rec.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}