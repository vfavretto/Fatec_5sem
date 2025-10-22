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
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Seção Esquerda - Informações */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div>
              <div className="inline-flex items-center justify-center lg:justify-start mb-6">
                <div className="icon-container bg-gradient-to-br from-primary to-secondary">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                Sistema de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Criptografia</span>
              </h1>
              <p className="text-xl text-white/60 mb-8">
                4 métodos clássicos de criptografia com segurança moderna
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              <div className="card-elevated p-6 group hover:border-primary/40">
                <div className="flex items-center space-x-4">
                  <div className="icon-container bg-primary/10 group-hover:bg-primary/20">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">Segurança Avançada</h3>
                    <p className="text-white/50 text-sm">Hash único para cada mensagem</p>
                  </div>
                </div>
              </div>

              <div className="card-elevated p-6 group hover:border-secondary/40">
                <div className="flex items-center space-x-4">
                  <div className="icon-container bg-secondary/10 group-hover:bg-secondary/20">
                    <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">Rápido e Eficiente</h3>
                    <p className="text-white/50 text-sm">Criptografia instantânea</p>
                  </div>
                </div>
              </div>

              <div className="card-elevated p-6 group hover:border-accent/40">
                <div className="flex items-center space-x-4">
                  <div className="icon-container bg-accent/10 group-hover:bg-accent/20">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">Totalmente Privado</h3>
                    <p className="text-white/50 text-sm">Suas mensagens são suas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção Direita - Formulário de Login */}
          <div className="animate-slide-up">
            <div className="card-modern p-8 lg:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo!</h2>
                <p className="text-white/60">Entre para começar a criptografar suas mensagens</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-3 text-sm">
                    Nome de Usuário
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-modern"
                    placeholder="Digite seu nome"
                    required
                    disabled={loading}
                    autoFocus
                  />
                  <p className="text-white/40 text-xs mt-2 flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>Modo teste - qualquer nome funciona</span>
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn-primary-modern"
                  disabled={loading || !username.trim()}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Entrar no Sistema</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-center text-xs text-white/40">
                  Desenvolvido com segurança em mente • Cyber Security
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

