import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Encrypt from './components/Encrypt';
import Decrypt from './components/Decrypt';

function App() {
  const [token, setToken] = useState(null);
  const [currentView, setCurrentView] = useState('encrypt');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    if (savedToken) {
      setToken(savedToken);
      setUsername(savedUsername || '');
    }
  }, []);

  const handleLogin = (newToken, user) => {
    setToken(newToken);
    setUsername(user);
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', user);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setCurrentView('encrypt');
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-[#2a2430]/50">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="icon-container bg-gradient-to-br from-primary to-secondary">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Sistema de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Criptografia</span>
                  </h1>
                  <p className="text-xs text-white/50">Multi-método • César • ROT13 • Base64 • Atbash</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3 card-elevated px-5 py-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Usuário</p>
                    <p className="text-white font-semibold">{username}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="btn-outline-modern flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="border-b border-white/10 backdrop-blur-xl bg-[#2a2430]/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('encrypt')}
                className={`relative py-4 px-8 font-semibold transition-all duration-300 ${
                  currentView === 'encrypt'
                    ? 'text-primary'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Criptografar</span>
                </div>
                {currentView === 'encrypt' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-t-full"></div>
                )}
              </button>
              <button
                onClick={() => setCurrentView('decrypt')}
                className={`relative py-4 px-8 font-semibold transition-all duration-300 ${
                  currentView === 'decrypt'
                    ? 'text-primary'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  <span>Descriptografar</span>
                </div>
                {currentView === 'decrypt' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-t-full"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'encrypt' ? (
              <Encrypt token={token} />
            ) : (
              <Decrypt token={token} />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 backdrop-blur-xl bg-[#2a2430]/30 py-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <p className="text-white/50 text-sm">
                Sistema Multi-método de Criptografia Clássica
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <span className="text-white/40">Cyber Security</span>
                <span className="text-white/40">•</span>
                <span className="text-white/40">2025</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;

