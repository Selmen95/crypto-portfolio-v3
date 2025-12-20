import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, BarChart, Mic, ShieldCheck } from 'lucide-react';
import QuickTrade from '@/components/landing/QuickTrade';
import LiveMarkets from '@/components/landing/LiveMarkets';

const features = [
  {
    icon: <BarChart className="w-6 h-6 text-purple-400" />,
    title: "Advanced Analytics",
    description: "Professional-grade charts, technical indicators, and market insights to make informed trading decisions."
  },
  {
    icon: <Mic className="w-6 h-6 text-blue-400" />,
    title: "Voice Trading",
    description: "Execute trades using voice commands with our AI-powered trading assistant for hands-free portfolio management."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-green-400" />,
    title: "Bank-Grade Security",
    description: "Your assets are protected by institutional-grade security measures including cold storage and insurance coverage."
  }
];

export default function Landing() {
  return (
    <div className="bg-[#0D0D11] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D11]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to={createPageUrl("Landing")} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 7L12 12L22 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xl font-bold">CryptoPro</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#" className="hover:text-white transition-colors">Trading</a>
            <a href="#" className="hover:text-white transition-colors">Markets</a>
            <a href="#" className="hover:text-white transition-colors">Products</a>
            <a href="#" className="hover:text-white transition-colors">Analytics</a>
            <a href="#" className="hover:text-white transition-colors">Learn</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("Dashboard")}>
              <Button variant="ghost" className="text-sm">Sign In</Button>
            </Link>
            <Link to={createPageUrl("Dashboard")}>
              <Button className="text-sm bg-white text-black hover:bg-slate-200">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm font-medium mb-6 border border-green-500/20">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Advanced Trading Platform
            </div>
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Trade crypto<br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">like a pro</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-md mx-auto md:mx-0 mb-8">
              Access professional trading tools, real-time market data, and institutional-grade security for Bitcoin, Ethereum, and 200+ cryptocurrencies.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 mb-12">
              <Link to={createPageUrl("Dashboard")}>
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90">Start Trading</Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-transparent border-slate-700">View Demo</Button>
            </div>
            <div className="flex justify-center md:justify-start gap-8">
              <div>
                <p className="text-3xl font-bold">$24B+</p>
                <p className="text-sm text-slate-400">24h Volume</p>
              </div>
              <div>
                <p className="text-3xl font-bold">150K+</p>
                <p className="text-sm text-slate-400">Active Traders</p>
              </div>
              <div>
                <p className="text-3xl font-bold">200+</p>
                <p className="text-sm text-slate-400">Cryptocurrencies</p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            <QuickTrade />
            <LiveMarkets />
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-900/50 border border-slate-800 p-6 text-center hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 mb-4">{feature.description}</p>
              <a href="#" className="font-semibold text-sm flex items-center justify-center gap-1 hover:text-purple-400 transition-colors">
                Learn more <ArrowRight className="w-4 h-4" />
              </a>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 7L12 12L22 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 12V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span className="text-xl font-bold">CryptoPro</span>
            </div>
            <p className="text-sm text-slate-400">The most advanced cryptocurrency trading platform built for professionals and institutions worldwide.</p>
          </div>
          <div className="md:col-start-2">
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white">Spot Trading</a></li>
              <li><a href="#" className="hover:text-white">Futures Trading</a></li>
              <li><a href="#" className="hover:text-white">Options Trading</a></li>
              <li><a href="#" className="hover:text-white">NFT Marketplace</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">API Documentation</a></li>
              <li><a href="#" className="hover:text-white">Trading Guides</a></li>
              <li><a href="#" className="hover:text-white">System Status</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-slate-500 flex justify-between items-center">
            <p>&copy; 2024 CryptoPro. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#">English</a>
              <a href="#">USD</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}