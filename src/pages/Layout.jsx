
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { 
  TrendingUp, 
  Settings, 
  BarChart3, 
  Wallet,
  Activity,
  Shield,
  ArrowUpDown,
  MessageCircle,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Target,
  Bell,
  LineChart,
  FileText,
  DollarSign,
  Zap
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar";
import SupportChat from "@/components/support/SupportChat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";


const navigationItems = [
  {
    title: "Tableau de Bord",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
  {
    title: "Mes Actifs",
    url: createPageUrl("Assets"),
    icon: TrendingUp,
  },
  {
    title: "Transactions",
    url: createPageUrl("Transactions"),
    icon: ArrowUpDown,
  },
  {
    title: "Objectifs",
    url: createPageUrl("Goals"),
    icon: Target,
  },
  {
    title: "Alertes",
    url: createPageUrl("Alerts"),
    icon: Bell,
  },
  {
    title: "Simulateur",
    url: createPageUrl("Simulator"),
    icon: Zap,
  },
  {
    title: "Analyse",
    url: createPageUrl("Analysis"),
    icon: LineChart,
  },
  {
    title: "Dividendes",
    url: createPageUrl("Dividends"),
    icon: DollarSign,
  },
  {
    title: "Import/Export",
    url: createPageUrl("ImportExport"),
    icon: FileText,
  },
  {
    title: "Portefeuille",
    url: createPageUrl("Wallet"),
    icon: Wallet,
  },
  {
    title: "Paramètres",
    url: createPageUrl("Settings"),
    icon: Settings,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (e) {
        // Not logged in
      }
    };
    fetchUser();
  }, []);

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --background: 0 0% 6%;
            --foreground: 0 0% 98%;
            --card: 0 0% 8%;
            --card-foreground: 0 0% 98%;
            --popover: 0 0% 8%;
            --popover-foreground: 0 0% 98%;
            --primary: 238 76% 56%;
            --primary-foreground: 356 29% 98%;
            --secondary: 0 0% 14%;
            --secondary-foreground: 0 0% 98%;
            --muted: 0 0% 14%;
            --muted-foreground: 0 0% 63%;
            --accent: 0 0% 14%;
            --accent-foreground: 0 0% 98%;
            --destructive: 0 84% 60%;
            --destructive-foreground: 0 0% 98%;
            --border: 0 0% 14%;
            --input: 0 0% 14%;
            --ring: 142 76% 36%;
            --radius: 0.75rem;
          }
          
          body {
            background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
            min-height: 100vh;
          }
          
          .glass-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
          }
          
          .trading-glow {
            box-shadow: 0 4px 24px rgba(34, 197, 94, 0.15);
          }
          
          .crypto-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          
          .profit-glow {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
          }

          .support-chat {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            border-radius: 50px;
            padding: 12px 20px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .support-chat:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(99, 102, 241, 0.6);
          }
        `}
      </style>
      
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
        <Sidebar className="border-r border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <SidebarHeader className="border-b border-slate-800 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 text-lg">AssetFlow</h2>
                <p className="text-xs text-slate-400">Gestion Patrimoine</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider px-3 py-3">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                      asChild 
                      className={`hover:bg-slate-800/50 hover:text-indigo-400 transition-all duration-200 rounded-xl mb-2 ${
                        location.pathname === item.url ? 'bg-indigo-500/20 text-indigo-400 border-l-2 border-indigo-400' : 'text-slate-300'
                      }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider px-3 py-2">
                Statut
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-slate-300">Synchronisé</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    <span className="text-slate-300">Suivi en temps réel</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span className="text-slate-300">Sécurisé</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-800 p-4">
            <div className="flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 cursor-pointer group">
                    {user?.profile_picture_url ? (
                      <img src={user.profile_picture_url} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">{user?.full_name || 'Investisseur'}</p>
                      <p className="text-xs text-slate-400 truncate">Portefeuille Multi-Actifs</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" side="top" align="start">
                  <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Profile")}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => base44.auth.logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <NotificationDropdown />
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-6 lg:p-10">{children}</div>
        </main>

        {/* Floating Support Chat */}
        <div onClick={() => setIsChatOpen(true)}>
          <div className="support-chat flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span>Support</span>
          </div>
        </div>
        <SupportChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </SidebarProvider>
  );
}
