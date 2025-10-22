import React, { useState, useEffect } from 'react';
import { cipherAPI } from '../utils/api';

function Encrypt({ token }) {
  const [message, setMessage] = useState('');
  const [shift, setShift] = useState(3);
  const [method, setMethod] = useState('caesar');
  const [methods, setMethods] = useState([
    { id: 'caesar', name: 'Cifra de César', description: 'Deslocamento de caracteres', requiresShift: true },
    { id: 'rot13', name: 'ROT13', description: 'Rotação fixa 13', requiresShift: false },
    { id: 'base64', name: 'Base64', description: 'Codificação Base64', requiresShift: false },
    { id: 'atbash', name: 'Atbash', description: 'Inversão do alfabeto', requiresShift: false }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const data = await cipherAPI.getMethods(token);
        if (data.methods && data.methods.length > 0) {
          setMethods(data.methods);
        }
      } catch (err) {
        console.error('Error fetching methods:', err);
        // Mantém os métodos padrão se falhar
      }
    };
    fetchMethods();
  }, [token]);

  const handleEncrypt = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const data = await cipherAPI.encrypt(token, message, parseInt(shift), method);
      setResult(data);
      setMessage('');
      setShift(3);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Erro ao criptografar. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    alert(`${type} copiado para a área de transferência!`);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="section-title">Criptografar Mensagem</h2>
        <p className="section-subtitle">
          Digite sua mensagem e escolha o deslocamento para gerar a criptografia
        </p>
      </div>

      {error && (
        <div className="alert-modern-error mb-8">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold mb-1">Erro!</p>
              <p className="text-sm text-white/90">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Card Principal - Formulário */}
        <div className="lg:col-span-2">
          <div className="card-elevated p-8">
            <form onSubmit={handleEncrypt} className="space-y-8">
              {/* Seletor de Método */}
              <div>
                <label className="block text-white font-semibold mb-4 text-base flex items-center space-x-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Método de Criptografia</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {methods.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        method === m.id
                          ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary text-primary'
                          : 'bg-[#2a2430] border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-sm mb-1">{m.name}</div>
                      <div className="text-xs opacity-75">{m.description.split(' ').slice(0, 2).join(' ')}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-4 text-base flex items-center space-x-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Mensagem Original</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-modern min-h-[180px] resize-none font-mono"
                  placeholder="Digite a mensagem que deseja criptografar..."
                  required
                  disabled={loading}
                />
                <p className="text-white/40 text-sm mt-3 flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Aceita todos os caracteres</span>
                </p>
              </div>

              {/* Slider de Shift - apenas para Caesar */}
              {method === 'caesar' && (
                <div>
                  <label className="block text-white font-semibold mb-4 text-base flex items-center space-x-2">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    <span>Deslocamento (Shift): {shift}</span>
                  </label>
                  <div className="flex items-center space-x-6">
                    <input
                      type="range"
                      min="-25"
                      max="25"
                      value={shift}
                      onChange={(e) => setShift(e.target.value)}
                      className="flex-1 h-3 bg-[#2a2430] rounded-full appearance-none cursor-pointer accent-primary"
                      disabled={loading}
                      style={{
                        background: `linear-gradient(to right, #F25D07 0%, #F2A922 ${((parseInt(shift) + 25) / 50) * 100}%, #2a2430 ${((parseInt(shift) + 25) / 50) * 100}%)`
                      }}
                    />
                    <div className="card-elevated px-6 py-4 min-w-[100px] text-center border-2 border-primary/30">
                      <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{shift}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-white/40 mt-2 px-1">
                    <span>-25 (Esquerda)</span>
                    <span>0 (Neutro)</span>
                    <span>+25 (Direita)</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary-modern"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Criptografando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Criptografar Mensagem</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar - Cards Informativos */}
        <div className="space-y-6">
          <div className="card-elevated p-6 group hover:border-primary/40">
            <div className="icon-container bg-primary/10 group-hover:bg-primary/20 mb-4">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Hash Único</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Cada criptografia gera um hash único que só pode ser usado uma vez
            </p>
          </div>

          <div className="card-elevated p-6 group hover:border-secondary/40">
            <div className="icon-container bg-secondary/10 group-hover:bg-secondary/20 mb-4">
              <svg className="w-7 h-7 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Segurança</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Armazenamento seguro no banco de dados com validação
            </p>
          </div>

          <div className="card-elevated p-6 group hover:border-accent/40">
            <div className="icon-container bg-accent/10 group-hover:bg-accent/20 mb-4">
              <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">4 Métodos</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              César, ROT13, Base64 e Atbash disponíveis
            </p>
          </div>
        </div>
      </div>

      {/* Resultado da Criptografia */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          <div className="alert-modern-success">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-bold text-lg mb-1">✓ Mensagem criptografada com sucesso!</p>
                  <p className="text-sm text-white/80">Guarde o hash com segurança, ele será usado para descriptografar</p>
                </div>
              </div>
              <div className="badge-modern bg-primary/20 text-primary border-2 border-primary/40">
                {methods.find(m => m.id === result.method)?.name || result.method}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Mensagem Criptografada */}
            <div className="card-elevated p-8">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg">Mensagem Criptografada</h3>
                </div>
                <button
                  onClick={() => copyToClipboard(result.encrypted, 'Mensagem')}
                  className="btn-secondary-modern text-sm py-2 px-4"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copiar</span>
                  </div>
                </button>
              </div>
              <div className="bg-[#1a1620] p-6 rounded-xl border-2 border-primary/20">
                <code className="text-primary break-all font-mono text-base leading-relaxed">{result.encrypted}</code>
              </div>
            </div>

            {/* Hash */}
            <div className="card-elevated p-8">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg">Hash (Chave Privada)</h3>
                </div>
                <button
                  onClick={() => copyToClipboard(result.hash, 'Hash')}
                  className="btn-secondary-modern text-sm py-2 px-4"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copiar</span>
                  </div>
                </button>
              </div>
              <div className="bg-[#1a1620] p-6 rounded-xl border-2 border-secondary/20 max-h-[200px] overflow-y-auto">
                <code className="text-secondary break-all font-mono text-xs leading-relaxed">{result.hash}</code>
              </div>
            </div>
          </div>

          {/* Aviso Importante */}
          <div className="card-elevated p-8 border-2 border-secondary/30">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-bold text-xl mb-2">⚠️ Importante!</h4>
                <p className="text-white/80 text-base leading-relaxed mb-2">
                  Guarde este hash com segurança! Ele será usado <span className="text-secondary font-bold">apenas uma vez</span> para descriptografar a mensagem.
                </p>
                <p className="text-white/60 text-sm">
                  Após usar o hash para descriptografar, ele será invalidado permanentemente por questões de segurança.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Encrypt;
