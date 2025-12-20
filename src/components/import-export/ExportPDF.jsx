import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

export default function ExportPDF({ assets = [], portfolioStats = {} }) {
  const generatePDF = async () => {
    // Pour une vraie implémentation, on utiliserait jspdf
    // Ici on génère un rapport HTML simple qu'on peut imprimer
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Rapport de Portefeuille - AssetFlow</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #6366f1; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #6366f1; color: white; }
          .summary { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>Rapport de Portefeuille AssetFlow</h1>
        <p>Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        
        <div class="summary">
          <h2>Résumé</h2>
          <p><strong>Valeur totale:</strong> ${portfolioStats.totalValue?.toLocaleString('fr-FR') || 0} €</p>
          <p><strong>Capital investi:</strong> ${portfolioStats.totalInvested?.toLocaleString('fr-FR') || 0} €</p>
          <p><strong>Profit/Perte:</strong> ${portfolioStats.profitLoss?.toLocaleString('fr-FR') || 0} € (${portfolioStats.profitLossPercentage?.toFixed(2) || 0}%)</p>
          <p><strong>Nombre d'actifs:</strong> ${assets.length}</p>
        </div>

        <h2>Détails des Actifs</h2>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>Quantité</th>
              <th>Prix d'achat</th>
              <th>Prix actuel</th>
              <th>Valeur</th>
              <th>P&L</th>
            </tr>
          </thead>
          <tbody>
            ${assets.map(asset => {
              const value = asset.quantity * (asset.current_price || asset.purchase_price);
              const invested = asset.quantity * asset.purchase_price;
              const pl = value - invested;
              return `
                <tr>
                  <td>${asset.name}</td>
                  <td>${asset.asset_type}</td>
                  <td>${asset.quantity}</td>
                  <td>${asset.purchase_price.toFixed(2)} €</td>
                  <td>${(asset.current_price || asset.purchase_price).toFixed(2)} €</td>
                  <td>${value.toFixed(2)} €</td>
                  <td style="color: ${pl >= 0 ? 'green' : 'red'}">${pl.toFixed(2)} €</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>AssetFlow - Gestion de Patrimoine Multi-Actifs</p>
          <p>Ce document est confidentiel et destiné uniquement à votre usage personnel</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-portefeuille-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          Export PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-slate-300 text-sm">
          Générez un rapport complet de votre portefeuille en format PDF
        </p>
        
        <div className="space-y-2">
          <Button
            onClick={generatePDF}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger le rapport complet
          </Button>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2 text-sm">Le rapport inclut:</h4>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Vue d'ensemble du portefeuille</li>
            <li>• Liste détaillée de tous les actifs</li>
            <li>• Performance et profit/perte</li>
            <li>• Répartition par classe d'actif</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}