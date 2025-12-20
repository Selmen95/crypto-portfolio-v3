import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  User as UserIcon, 
  Bell, 
  Camera,
  Award,
  TrendingUp,
  DollarSign,
  Mail,
  Save,
  FileText
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser({
          ...userData,
          notifications_config: userData.notifications_config || { email_trades: true, email_profits: true, email_community: true }
      });
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
        const { id, created_date, updated_date, email, role, ...updateData } = user;
        await base44.auth.updateMe(updateData);
        setSaveMessage("Profil enregistré avec succès !");
    } catch (e) {
        setSaveMessage("Erreur lors de l'enregistrement.");
    } finally {
        setIsSaving(false);
        setTimeout(() => setSaveMessage(""), 3000);
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setUser(prev => ({...prev, profile_picture_url: file_url }));
    } catch (error) {
        console.error("Error uploading image:", error);
        setSaveMessage("Erreur lors du téléchargement de l'image.");
        setTimeout(() => setSaveMessage(""), 3000);
    }
  };
  
  const handleNotificationChange = (key, value) => {
    setUser(prev => ({
        ...prev,
        notifications_config: {
            ...prev.notifications_config,
            [key]: value
        }
    }))
  }

  const achievements = [
    {
      title: "First Trade",
      description: "Completed your first successful trade",
      earned: true,
      date: "2 weeks ago"
    },
    {
      title: "Profit Streak",
      description: "5 consecutive profitable trades",
      earned: true,
      date: "1 week ago"
    },
    {
      title: "Risk Master",
      description: "Maintain <2% drawdown for 30 days",
      earned: false,
      progress: "18/30 days"
    },
    {
      title: "Community Helper",
      description: "Help 10 traders in community",
      earned: false,
      progress: "3/10 helped"
    }
  ];

  const stats = [
    {
      label: "Total Profit",
      value: "$12,847",
      change: "+23.4%",
      icon: DollarSign,
      color: "text-green-400"
    },
    {
      label: "Win Rate",
      value: "73.2%",
      change: "+5.1%",
      icon: TrendingUp,
      color: "text-blue-400"
    },
    {
      label: "Total Trades",
      value: "156",
      change: "+12",
      icon: Award,
      color: "text-purple-400"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <UserIcon className="w-8 h-8" />
            Profile & Settings
          </h1>
          <p className="text-slate-400">
            Manage your account, preferences, and view your trading achievements
          </p>
        </div>

        {saveMessage && (
          <Alert className="mb-6 bg-green-500/20 border-green-500/30">
            <AlertDescription className="text-green-400">
              {saveMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    {user?.profile_picture_url ? (
                        <img src={user.profile_picture_url} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">
                            {user?.full_name?.charAt(0) || 'U'}
                            </span>
                        </div>
                    )}
                    <button onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                  </div>
                  <div className="flex-1">
                     <Input 
                        className="bg-slate-800 border-slate-700 text-white font-bold text-xl"
                        value={user?.full_name || ''}
                        onChange={(e) => setUser({...user, full_name: e.target.value})}
                     />
                    <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
                  </div>
                </div>
                 <Textarea 
                    placeholder="Your bio..."
                    className="bg-slate-800 border-slate-700 text-white"
                    value={user?.bio || ''}
                    onChange={(e) => setUser({...user, bio: e.target.value})}
                />
              </CardContent>
            </Card>

            {/* Trading Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Trading Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                          <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <span className="text-slate-300">{stat.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">{stat.value}</div>
                        <div className="text-xs text-green-400">{stat.change}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings and Achievements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notification Settings */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white flex items-center gap-2"><Mail className="w-4 h-4" /> Email Notifications</Label>
                      <p className="text-sm text-slate-400 ml-6">Receive alerts for executed trades</p>
                    </div>
                    <Switch
                      checked={user?.notifications_config.email_trades}
                      onCheckedChange={(checked) => handleNotificationChange('email_trades', checked)}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white flex items-center gap-2"><Mail className="w-4 h-4" /> Profit Alerts</Label>
                      <p className="text-sm text-slate-400 ml-6">Notifications for profit milestones</p>
                    </div>
                    <Switch
                      checked={user?.notifications_config.email_profits}
                      onCheckedChange={(checked) => handleNotificationChange('email_profits', checked)}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white flex items-center gap-2"><Mail className="w-4 h-4" /> Community Activity</Label>
                      <p className="text-sm text-slate-400 ml-6">Mentions, followers, and post replies</p>
                    </div>
                    <Switch
                      checked={user?.notifications_config.email_community}
                      onCheckedChange={(checked) => handleNotificationChange('email_community', checked)}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KYC Verification Placeholder */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Identity Verification (KYC)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-yellow-500/20 border-yellow-500/30">
                    <AlertDescription className="text-yellow-400">
                    Your account is unverified. Please complete KYC to unlock higher withdrawal limits.
                    </AlertDescription>
                </Alert>
                <p className="text-sm text-slate-400">
                    KYC is a mandatory security process. This feature requires integration with a dedicated third-party service and is currently disabled.
                </p>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700" disabled>
                  Start Verification
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.earned 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-slate-800/30 border-slate-700'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          achievement.earned ? 'bg-green-500' : 'bg-slate-600'
                        }`}>
                          <Award className="w-4 h-4 text-white" />
                        </div>
                        <h3 className={`font-semibold ${
                          achievement.earned ? 'text-green-400' : 'text-slate-400'
                        }`}>
                          {achievement.title}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{achievement.description}</p>
                      {achievement.earned ? (
                        <p className="text-xs text-green-400">Earned {achievement.date}</p>
                      ) : (
                        <p className="text-xs text-slate-500">Progress: {achievement.progress}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleProfileUpdate} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save All Changes'}
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}