import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Video, Download, MessageSquare, Sparkles } from 'lucide-react';
import HomePage from './pages/HomePage';
import DownloaderPage from './pages/DownloaderPage';
import ChatPage from './pages/ChatPage';

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Video AI', icon: Video },
    { path: '/downloader', label: 'Downloader', icon: Download },
    { path: '/chat', label: 'AI Chat', icon: MessageSquare },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-semibold tracking-tight">VideoAI Studio</span>
          </Link>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-black'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/downloader" element={<DownloaderPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
