import React, { useState } from 'react';
import { cipherAPI } from '../utils/api';

function Decrypt({ token }) {
  const [encrypted, setEncrypted] = useState('');
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleDecrypt = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const data = await cipherAPI.decrypt(token, encrypted, hash);
      setResult(data);
      setEncrypted('');
      setHash('');
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Erro ao descriptografar. Verifique os dados e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Mensagem copiada para a área de transferência!');
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="section-title">Descriptografar Mensagem</h2>
        <p className="section-subtitle">
          Insira a mensagem criptografada e o hash para revelar a mensagem original
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
            <form onSubmit={handleDecrypt} className="space-y-8">
              <div>
                <label className="block text-white font-semibold mb-4 text-base flex items-center space-x-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Mensagem Criptografada</span>
                </label>
                <textarea
                  value={encrypted}
                  onChange={(e) => setEncrypted(e.target.value)}
                  className="input-modern min-h-[150px] resize-none font-mono"
                  placeholder="Cole aqui a mensagem criptografada..."
                  required
                  disabled={loading}
                />
                <p className="text-white/40 text-sm mt-3 flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Cole a mensagem que foi gerada na criptografia</span>
                </p>
              </div>

              <div>
                <label className="block text-white font-semibold mb-4 text-base flex items-center space-x-2">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span>Hash (Chave Privada)</span>
                </label>
                <textarea
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  className="input-modern min-h-[120px] resize-none font-mono text-sm"
                  placeholder="Cole aqui o hash que foi gerado na criptografia..."
                  required
                  disabled={loading}
                />
                <div className="mt-3 card-elevated p-4 border-2 border-error/30">
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-white/80 text-sm">
                      <span className="font-bold text-error">Atenção:</span> O hash só pode ser usado <span className="font-bold">uma única vez</span> e será invalidado após o uso
                    </p>
                  </div>
                </div>
              </div>

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
                    <span>Descriptografando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    <span>Descriptografar Mensagem</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar - Cards Informativos */}
        <div className="space-y-6">
          <div className="card-elevated p-6 group hover:border-error/40">
            <div className="icon-container bg-error/10 group-hover:bg-error/20 mb-4">
              <svg className="w-7 h-7 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Uso Único</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Cada hash só pode ser usado uma única vez para garantir segurança máxima
            </p>
          </div>

          <div className="card-elevated p-6 group hover:border-primary/40">
            <div className="icon-container bg-primary/10 group-hover:bg-primary/20 mb-4">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Validação</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Verificação automática de hash no banco de dados antes da descriptografia
            </p>
          </div>

          <div className="card-elevated p-6 group hover:border-accent/40">
            <div className="icon-container bg-accent/10 group-hover:bg-accent/20 mb-4">
              <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Recuperação</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Recupera a mensagem original usando o algoritmo reverso da Cifra de César
            </p>
          </div>
        </div>
      </div>

      {/* Resultado da Descriptografia */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          <div className="alert-modern-success">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-bold text-lg mb-1">✓ Mensagem descriptografada com sucesso!</p>
                  <p className="text-sm text-white/80">O hash foi marcado como usado e não pode mais ser utilizado</p>
                </div>
              </div>
              {result.method && (
                <div className="badge-modern bg-primary/20 text-primary border-2 border-primary/40">
                  {result.method === 'caesar' ? 'Cifra de César' :
                   result.method === 'rot13' ? 'ROT13' :
                   result.method === 'base64' ? 'Base64' :
                   result.method === 'atbash' ? 'Atbash' : result.method}
                </div>
              )}
            </div>
          </div>

          {/* Mensagem Original Revelada */}
          <div className="card-elevated p-10 border-2 border-primary/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="icon-container bg-gradient-to-br from-primary to-secondary">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-2xl">Mensagem Original</h3>
              </div>
              <button
                onClick={() => copyToClipboard(result.decrypted)}
                className="btn-secondary-modern"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copiar</span>
                </div>
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-2xl border-2 border-primary/20">
              <p className="text-white text-2xl break-words leading-relaxed font-medium">{result.decrypted}</p>
            </div>
          </div>

          {/* Informação sobre o Hash */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-elevated p-8 border-2 border-accent/20">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-2">Hash Invalidado</h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Este hash foi marcado como usado no banco de dados e não poderá mais ser utilizado para descriptografar mensagens.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-elevated p-8 border-2 border-secondary/20">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-2">Segurança Garantida</h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Isso garante que cada mensagem criptografada só pode ser lida uma única vez, aumentando a segurança.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Decrypt;
