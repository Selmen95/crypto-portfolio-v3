import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ImportCSV({ onImportComplete }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleImport = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload file
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Extract data using AI
      const extractionResult = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            assets: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  symbol: { type: "string" },
                  asset_type: { type: "string" },
                  quantity: { type: "number" },
                  purchase_price: { type: "number" },
                  current_price: { type: "number" },
                  purchase_date: { type: "string" }
                }
              }
            }
          }
        }
      });

      if (extractionResult.status === "success" && extractionResult.output?.assets) {
        // Import assets in bulk
        await base44.entities.Asset.bulkCreate(extractionResult.output.assets);
        
        setResult({
          success: true,
          count: extractionResult.output.assets.length
        });

        if (onImportComplete) onImportComplete();
      } else {
        setResult({
          success: false,
          error: extractionResult.details || "Erreur lors de l'extraction"
        });
      }
    } catch (error) {
      console.error("Import error:", error);
      setResult({
        success: false,
        error: "Erreur lors de l'import"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Upload className="w-5 h-5 text-indigo-400" />
          Importer depuis CSV/Excel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center">
          <FileSpreadsheet className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 mb-4">
            Importez vos actifs depuis un fichier CSV ou Excel
          </p>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button asChild variant="outline">
              <span>Choisir un fichier</span>
            </Button>
          </label>
          {file && (
            <p className="text-sm text-indigo-400 mt-2">
              Fichier sélectionné: {file.name}
            </p>
          )}
        </div>

        {file && (
          <Button
            onClick={handleImport}
            disabled={isUploading}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {isUploading ? "Import en cours..." : "Importer les actifs"}
          </Button>
        )}

        {result && (
          <div className={`p-4 rounded-lg ${result.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
            <div className="flex items-center gap-2">
              {result.success ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400">
                    {result.count} actifs importés avec succès !
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400">{result.error}</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2 text-sm">Format attendu:</h4>
          <p className="text-xs text-slate-400">
            Nom, Symbole, Type, Quantité, Prix d'achat, Prix actuel, Date d'achat
          </p>
        </div>
      </CardContent>
    </Card>
  );
}