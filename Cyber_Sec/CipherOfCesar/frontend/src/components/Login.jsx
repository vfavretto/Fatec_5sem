import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      return;
    }

    setLoading(true);
    
    // Login simplificado para testes - aceita qualquer usuário
    setTimeout(() => {
      const mockToken = 'mock-token-' + Date.now();
      onLogin(mockToken, username);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-block p-5 rounded-2xl bg-lavender/20 border border-lavender/30 mb-6">
            <svg className="w-16 h-16 text-lavender" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-light text-white mb-2 tracking-wide">Cifra de César</h1>
          <p className="text-white/50 text-sm">Sistema de Criptografia</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-10 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/80 font-light mb-3 text-sm">
                Nome de Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Digite seu nome"
                required
                disabled={loading}
                autoFocus
              />
              <p className="text-white/40 text-xs mt-2">
                Modo teste - qualquer nome funciona
              </p>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !username.trim()}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-3 mt-8">
          <div className="glass-card p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-lavender/20 flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-lavender" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="text-xs text-white/60 font-light">Seguro</p>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-peach/20 flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-peach" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xs text-white/60 font-light">Rápido</p>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-rose/20 flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-xs text-white/60 font-light">Privado</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

