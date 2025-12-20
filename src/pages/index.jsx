import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Settings from "./Settings";

import Wallet from "./Wallet";

import AutoTrading from "./AutoTrading";

import Transactions from "./Transactions";

import Landing from "./Landing";

import Guide from "./Guide";

import Community from "./Community";

import Profile from "./Profile";

import Assets from "./Assets";

import Goals from "./Goals";

import Alerts from "./Alerts";

import Analysis from "./Analysis";

import ImportExport from "./ImportExport";

import Dividends from "./Dividends";

import Simulator from "./Simulator";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Settings: Settings,
    
    Wallet: Wallet,
    
    AutoTrading: AutoTrading,
    
    Transactions: Transactions,
    
    Landing: Landing,
    
    Guide: Guide,
    
    Community: Community,
    
    Profile: Profile,
    
    Assets: Assets,
    
    Goals: Goals,
    
    Alerts: Alerts,
    
    Analysis: Analysis,
    
    ImportExport: ImportExport,
    
    Dividends: Dividends,
    
    Simulator: Simulator,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Wallet" element={<Wallet />} />
                
                <Route path="/AutoTrading" element={<AutoTrading />} />
                
                <Route path="/Transactions" element={<Transactions />} />
                
                <Route path="/Landing" element={<Landing />} />
                
                <Route path="/Guide" element={<Guide />} />
                
                <Route path="/Community" element={<Community />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Assets" element={<Assets />} />
                
                <Route path="/Goals" element={<Goals />} />
                
                <Route path="/Alerts" element={<Alerts />} />
                
                <Route path="/Analysis" element={<Analysis />} />
                
                <Route path="/ImportExport" element={<ImportExport />} />
                
                <Route path="/Dividends" element={<Dividends />} />
                
                <Route path="/Simulator" element={<Simulator />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}