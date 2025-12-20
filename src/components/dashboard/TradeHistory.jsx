import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpCircle, ArrowDownCircle, Clock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function TradeHistory({ trades = [] }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStrategyColor = (strategy) => {
    switch(strategy) {
      case 'sma_crossover':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'rsi_mean_reversion':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Trades
          </CardTitle>
          <Badge variant="outline" className="text-slate-400 border-slate-600">
            {trades.length} trades
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-800/30">
                <TableHead className="text-slate-400">Time</TableHead>
                <TableHead className="text-slate-400">Side</TableHead>
                <TableHead className="text-slate-400">Price</TableHead>
                <TableHead className="text-slate-400">Amount</TableHead>
                <TableHead className="text-slate-400">Total</TableHead>
                <TableHead className="text-slate-400">Strategy</TableHead>
                <TableHead className="text-slate-400">P&L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <TrendingUp className="w-8 h-8 opacity-50" />
                      <span>No trades yet</span>
                      <span className="text-sm">Trades will appear here once your bot starts trading</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                trades.slice(0, 10).map((trade, index) => (
                  <TableRow key={trade.id || index} className="border-slate-800 hover:bg-slate-800/30">
                    <TableCell className="text-slate-300">
                      {format(new Date(trade.timestamp || trade.created_date), 'MMM d, HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {trade.side === 'buy' ? (
                          <ArrowUpCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <ArrowDownCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className={trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}>
                          {trade.side.toUpperCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300 font-mono">
                      {formatCurrency(trade.price)}
                    </TableCell>
                    <TableCell className="text-slate-300 font-mono">
                      {trade.amount?.toFixed(6)} BTC
                    </TableCell>
                    <TableCell className="text-slate-300 font-mono">
                      {formatCurrency(trade.total)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStrategyColor(trade.strategy)}>
                        {trade.strategy?.replace('_', ' ').toUpperCase() || 'MANUAL'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {trade.profit_loss && (
                        <span className={trade.profit_loss >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {trade.profit_loss >= 0 ? '+' : ''}
                          {formatCurrency(trade.profit_loss)}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}