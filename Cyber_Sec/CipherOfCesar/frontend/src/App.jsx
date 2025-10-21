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
    <div className="min-h-screen w-full flex flex-col">
      {/* Header */}
      <header className="glass-card m-6 p-5 animate-slide-up">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-lavender/20 border border-lavender/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-lavender" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-light text-white tracking-wide">Cifra de César</h1>
              <p className="text-xs text-white/50">Sistema de Criptografia</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-white/50 font-light">Usuário</p>
              <p className="text-white font-light">{username}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-rose/20 text-white hover:bg-rose/30 transition-colors duration-200 border border-rose/40 text-sm font-light"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="mx-6 mb-6">
        <div className="glass-card p-2 max-w-7xl mx-auto">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentView('encrypt')}
              className={`flex-1 py-3 px-6 rounded-lg font-light transition-all duration-200 ${
                currentView === 'encrypt'
                  ? 'bg-lavender text-navy-dark'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Criptografar</span>
              </div>
            </button>
            <button
              onClick={() => setCurrentView('decrypt')}
              className={`flex-1 py-3 px-6 rounded-lg font-light transition-all duration-200 ${
                currentView === 'decrypt'
                  ? 'bg-lavender text-navy-dark'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <span>Descriptografar</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 mx-6 mb-6">
        <div className="max-w-7xl mx-auto">
          {currentView === 'encrypt' ? (
            <Encrypt token={token} />
          ) : (
            <Decrypt token={token} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-card m-6 p-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/50 text-xs font-light">
            Sistema de Criptografia com Cifra de César | Cyber Security
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

