import React, { useState } from 'react';
import { cipherAPI } from '../utils/api';

function Encrypt({ token }) {
  const [message, setMessage] = useState('');
  const [shift, setShift] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleEncrypt = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const data = await cipherAPI.encrypt(token, message, parseInt(shift));
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
    <div className="glass-card p-10 animate-slide-up">
      <div className="mb-8">
        <h2 className="text-3xl font-light text-white mb-3">Criptografar Mensagem</h2>
        <p className="text-white/50 text-sm">
          Digite sua mensagem e escolha o deslocamento para gerar a criptografia.
        </p>
      </div>

      <form onSubmit={handleEncrypt} className="space-y-6">
        {error && (
          <div className="alert-error">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-white/80 font-light mb-3 text-sm">
            Mensagem
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input-field min-h-[120px] resize-none"
            placeholder="Digite a mensagem que deseja criptografar..."
            required
            disabled={loading}
          />
          <p className="text-white/40 text-xs mt-2">
            Aceita caracteres de a-z e 0-9
          </p>
        </div>

        <div>
          <label className="block text-white/80 font-light mb-3 text-sm">
            Deslocamento (Shift)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="-25"
              max="25"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-lavender"
              disabled={loading}
            />
            <div className="glass-card px-5 py-2 min-w-[80px] text-center border-lavender/20">
              <span className="text-2xl font-light text-lavender">{shift}</span>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-2">
            Número de posições para deslocar (positivo ou negativo)
          </p>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Criptografando...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Criptografar</span>
            </div>
          )}
        </button>
      </form>

      {result && (
        <div className="mt-10 space-y-5 animate-fade-in">
          <div className="alert-success">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-light">Mensagem criptografada com sucesso!</span>
            </div>
          </div>

          <div className="glass-card p-8 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-white/80 font-light text-sm">Mensagem Criptografada</label>
                <button
                  onClick={() => copyToClipboard(result.encrypted, 'Mensagem')}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  <div className="flex items-center space-x-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copiar</span>
                  </div>
                </button>
              </div>
              <div className="bg-black/20 p-5 rounded-lg border border-lavender/20">
                <code className="text-lavender break-all font-mono text-sm">{result.encrypted}</code>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-white/80 font-light text-sm">Hash (Chave Privada)</label>
                <button
                  onClick={() => copyToClipboard(result.hash, 'Hash')}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  <div className="flex items-center space-x-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copiar</span>
                  </div>
                </button>
              </div>
              <div className="bg-black/20 p-5 rounded-lg border border-peach/20">
                <code className="text-peach break-all font-mono text-xs">{result.hash}</code>
              </div>
            </div>

            <div className="bg-peach/10 border border-peach/30 rounded-lg p-5">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-peach flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-white font-light mb-1 text-sm">Importante</p>
                  <p className="text-white/70 text-xs font-light">
                    Guarde este hash com segurança! Ele será usado apenas uma vez para descriptografar a mensagem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-10 grid md:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-lavender/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-lavender" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-light mb-1 text-sm">Hash Único</h3>
              <p className="text-white/60 text-xs font-light">Cada hash só pode ser usado uma vez</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-rose/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-light mb-1 text-sm">Segurança</h3>
              <p className="text-white/60 text-xs font-light">Armazenamento seguro no banco</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-peach/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-peach" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-light mb-1 text-sm">Cifra de César</h3>
              <p className="text-white/60 text-xs font-light">Algoritmo clássico</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Encrypt;

