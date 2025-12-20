import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AssetForm from "../components/assets/AssetForm";
import AssetsList from "../components/assets/AssetsList";
import { AnimatePresence, motion } from "framer-motion";

export default function Assets() {
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const queryClient = useQueryClient();

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: () => base44.entities.Asset.list('-created_date'),
    initialData: [],
  });

  const createAssetMutation = useMutation({
    mutationFn: (assetData) => base44.entities.Asset.create(assetData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setShowForm(false);
      setEditingAsset(null);
    },
  });

  const updateAssetMutation = useMutation({
    mutationFn: ({ id, assetData }) => base44.entities.Asset.update(id, assetData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setShowForm(false);
      setEditingAsset(null);
    },
  });

  const deleteAssetMutation = useMutation({
    mutationFn: (id) => base44.entities.Asset.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });

  const handleSubmit = async (assetData) => {
    if (editingAsset) {
      updateAssetMutation.mutate({ id: editingAsset.id, assetData });
    } else {
      createAssetMutation.mutate(assetData);
    }
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet actif ?")) {
      deleteAssetMutation.mutate(id);
    }
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
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mes Actifs
            </h1>
            <p className="text-slate-400 text-lg">
              Gérez tous vos investissements en un seul endroit
            </p>
          </div>
          {!showForm && (
            <Button 
              onClick={() => {
                setEditingAsset(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvel Actif
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AssetForm
                  asset={editingAsset}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingAsset(null);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AssetsList
            assets={assets}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}