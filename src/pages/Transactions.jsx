import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Search, Filter, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const applyFilters = useCallback(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.asset_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.asset_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(tx => tx.transaction_type === typeFilter);
    }

    // Asset type filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.asset_type === statusFilter);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, statusFilter, typeFilter]);

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadTransactions = async () => {
    try {
      const data = await base44.entities.Transaction.list("-transaction_date", 100);
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeColor = (type) => {
    return type === 'buy' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getAssetTypeColor = (assetType) => {
    const colors = {
      stock: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      crypto: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      real_estate: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      commodity: 'bg-red-500/20 text-red-400 border-red-500/30',
      bond: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      etf: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      other: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    };
    return colors[assetType] || colors.other;
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
            <ArrowUpDown className="w-8 h-8 text-indigo-400" />
            Historique des Transactions
          </h1>
          <p className="text-slate-400 text-lg">
            Toutes vos opérations d'achat et de vente
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all">Tous types</SelectItem>
                  <SelectItem value="buy">Achats</SelectItem>
                  <SelectItem value="sell">Ventes</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Actif" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all">Tous actifs</SelectItem>
                  <SelectItem value="stock">Actions</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="real_estate">Immobilier</SelectItem>
                  <SelectItem value="commodity">Matières Premières</SelectItem>
                  <SelectItem value="bond">Obligations</SelectItem>
                  <SelectItem value="etf">ETF</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-right">
                <div className="text-sm text-slate-400">Total</div>
                <div className="text-lg font-bold text-white">{filteredTransactions.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-slate-800/30">
                    <TableHead className="text-slate-400">Date</TableHead>
                    <TableHead className="text-slate-400">Actif</TableHead>
                    <TableHead className="text-slate-400">Type</TableHead>
                    <TableHead className="text-slate-400">Quantité</TableHead>
                    <TableHead className="text-slate-400">Prix</TableHead>
                    <TableHead className="text-slate-400">Total</TableHead>
                    <TableHead className="text-slate-400">Frais</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <Clock className="w-12 h-12 opacity-50" />
                          <span>Aucune transaction trouvée</span>
                          <span className="text-sm">Essayez d'ajuster vos filtres</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((tx, index) => (
                      <TableRow key={tx.id || index} className="border-slate-800 hover:bg-slate-800/30">
                        <TableCell className="text-slate-300">
                          <div>
                            <div>{tx.transaction_date ? format(new Date(tx.transaction_date), 'dd MMM yyyy') : format(new Date(tx.created_date), 'dd MMM yyyy')}</div>
                            <div className="text-sm text-slate-400">
                              {tx.transaction_date ? format(new Date(tx.transaction_date), 'HH:mm') : format(new Date(tx.created_date), 'HH:mm')}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <div className="text-white font-medium">{tx.asset_name}</div>
                            <Badge className={getAssetTypeColor(tx.asset_type)} variant="outline">
                              {tx.asset_type}
                            </Badge>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge className={getTypeColor(tx.transaction_type)}>
                            {tx.transaction_type === 'buy' ? 'ACHAT' : 'VENTE'}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-white font-medium">
                          {tx.quantity}
                        </TableCell>

                        <TableCell className="text-slate-300">
                          ${tx.price.toFixed(2)}
                        </TableCell>

                        <TableCell>
                          <div className={`font-semibold ${tx.transaction_type === 'buy' ? 'text-red-400' : 'text-green-400'}`}>
                            {tx.transaction_type === 'buy' ? '-' : '+'}${tx.total_amount.toFixed(2)}
                          </div>
                        </TableCell>

                        <TableCell className="text-slate-400">
                          ${tx.fees?.toFixed(2) || '0.00'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}