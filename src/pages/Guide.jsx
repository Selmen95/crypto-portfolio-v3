import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  PlayCircle, 
  BookOpen, 
  Settings, 
  TrendingUp,
  Zap,
  ChevronRight,
  CheckCircle
} from "lucide-react";

export default function Guide() {
  const [activeTab, setActiveTab] = useState('getting-started');

  const tutorials = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: PlayCircle,
      lessons: [
        {
          title: "Account Setup & Verification",
          duration: "5 min",
          completed: true,
          description: "Create your account and complete verification process"
        },
        {
          title: "First Deposit & Wallet Setup",
          duration: "10 min",
          completed: true,
          description: "Learn how to deposit funds and set up your crypto wallet"
        },
        {
          title: "Dashboard Overview",
          duration: "8 min",
          completed: false,
          description: "Navigate the trading dashboard and understand key metrics"
        },
        {
          title: "Setting Your First Trade",
          duration: "12 min",
          completed: false,
          description: "Execute your first manual trade with proper risk management"
        }
      ]
    },
    {
      id: 'trading-strategies',
      title: 'Trading Strategies',
      icon: TrendingUp,
      lessons: [
        {
          title: "Moving Average Crossover",
          duration: "15 min",
          completed: false,
          description: "Understand SMA strategy and when to use it"
        },
        {
          title: "RSI Mean Reversion",
          duration: "12 min",
          completed: false,
          description: "Learn RSI indicators and reversal patterns"
        },
        {
          title: "Risk Management",
          duration: "20 min",
          completed: false,
          description: "Stop losses, take profits, and position sizing"
        },
        {
          title: "Backtesting Strategies",
          duration: "18 min",
          completed: false,
          description: "Test strategies on historical data"
        }
      ]
    },
    {
      id: 'auto-trading',
      title: 'Auto Trading',
      icon: Zap,
      lessons: [
        {
          title: "Setting Up Auto Bot",
          duration: "10 min",
          completed: false,
          description: "Configure your first automated trading bot"
        },
        {
          title: "Strategy Parameters",
          duration: "15 min",
          completed: false,
          description: "Fine-tune bot settings for optimal performance"
        },
        {
          title: "Monitoring & Adjustments",
          duration: "12 min",
          completed: false,
          description: "Track bot performance and make adjustments"
        },
        {
          title: "Auto Cashout Setup",
          duration: "8 min",
          completed: false,
          description: "Automatic profit taking and reinvestment"
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Features',
      icon: Settings,
      lessons: [
        {
          title: "API Integration",
          duration: "25 min",
          completed: false,
          description: "Connect external exchanges and tools"
        },
        {
          title: "Custom Indicators",
          duration: "30 min",
          completed: false,
          description: "Build and deploy custom trading indicators"
        },
        {
          title: "Portfolio Optimization",
          duration: "20 min",
          completed: false,
          description: "Advanced portfolio allocation strategies"
        },
        {
          title: "Tax Reporting",
          duration: "15 min",
          completed: false,
          description: "Generate reports for tax compliance"
        }
      ]
    }
  ];

  const quickStart = [
    {
      step: 1,
      title: "Create Account",
      description: "Sign up with email or Google",
      time: "2 min"
    },
    {
      step: 2,
      title: "Verify Identity",
      description: "Complete KYC verification",
      time: "5 min"
    },
    {
      step: 3,
      title: "Deposit Funds",
      description: "Add crypto or fiat to your wallet",
      time: "10 min"
    },
    {
      step: 4,
      title: "Configure Bot",
      description: "Set up your first trading strategy",
      time: "15 min"
    },
    {
      step: 5,
      title: "Start Trading",
      description: "Activate bot and monitor performance",
      time: "5 min"
    }
  ];

  const faqs = [
    {
      question: "Is auto trading safe?",
      answer: "Yes, our platform uses advanced risk management and you maintain full control over your funds. Start with small amounts and paper trading."
    },
    {
      question: "What's the minimum deposit?",
      answer: "You can start with as little as $50. We recommend starting with $500-1000 for optimal strategy performance."
    },
    {
      question: "How much can I expect to earn?",
      answer: "Returns vary based on market conditions and strategy. Historical performance shows 15-45% annual returns, but past performance doesn't guarantee future results."
    },
    {
      question: "Can I withdraw my funds anytime?",
      answer: "Yes, you can withdraw your funds 24/7. Withdrawals typically process within 1-24 hours depending on the cryptocurrency."
    }
  ];

  const currentTutorial = tutorials.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <HelpCircle className="w-8 h-8" />
            Trading Guide & Tutorials
          </h1>
          <p className="text-slate-400">
            Learn how to maximize your crypto trading profits with our comprehensive guides
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tutorial Navigation */}
          <div className="lg:col-span-1">
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle className="text-white">Quick Start Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickStart.map((item) => (
                  <div key={item.step} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white text-sm">{item.title}</div>
                      <div className="text-xs text-slate-400">{item.description}</div>
                    </div>
                    <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs">
                      {item.time}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Learning Paths</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tutorials.map((tutorial) => (
                  <button
                    key={tutorial.id}
                    onClick={() => setActiveTab(tutorial.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      activeTab === tutorial.id 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <tutorial.icon className="w-5 h-5" />
                    <span className="font-medium">{tutorial.title}</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Tutorial Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Tutorial */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <currentTutorial.icon className="w-6 h-6" />
                  {currentTutorial.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentTutorial.lessons.map((lesson, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        lesson.completed ? 'bg-green-500' : 'bg-slate-600'
                      }`}>
                        {lesson.completed ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <PlayCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{lesson.title}</h3>
                        <p className="text-sm text-slate-400">{lesson.description}</p>
                      </div>
                      <div className="text-sm text-slate-400">{lesson.duration}</div>
                      <Button 
                        size="sm" 
                        variant={lesson.completed ? "outline" : "default"}
                        className={lesson.completed ? "border-slate-600 text-slate-300" : "bg-green-600 hover:bg-green-700"}
                      >
                        {lesson.completed ? "Review" : "Start"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="p-4 rounded-lg bg-slate-800/30">
                      <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
                      <p className="text-slate-400">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}