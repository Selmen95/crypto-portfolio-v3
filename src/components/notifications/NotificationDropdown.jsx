import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, TrendingUp } from "lucide-react";

export default function NotificationDropdown() {
  const notifications = [
    {
      icon: <CheckCircle className="w-4 h-4 text-green-400" />,
      text: "Votre transaction Apple Inc. a été enregistrée.",
      time: "il y a 2 minutes",
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
      text: "Nouveau record : Votre portefeuille atteint $500K.",
      time: "il y a 15 minutes",
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-purple-400" />,
      text: "Bitcoin a augmenté de 5% aujourd'hui.",
      time: "il y a 1 heure",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
          <Bell className="w-5 h-5" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" side="top" align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification, index) => (
          <DropdownMenuItem key={index} className="flex items-start gap-3">
            {notification.icon}
            <div className="flex-1">
              <p className="text-sm">{notification.text}</p>
              <p className="text-xs text-slate-500">{notification.time}</p>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center">
            Voir toutes les notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}