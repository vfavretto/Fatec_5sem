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
    <div className="glass-card p-10 animate-slide-up">
      <div className="mb-8">
        <h2 className="text-3xl font-light text-white mb-3">Descriptografar Mensagem</h2>
        <p className="text-white/50 text-sm">
          Insira a mensagem criptografada e o hash para revelar a mensagem original.
        </p>
      </div>

      <form onSubmit={handleDecrypt} className="space-y-6">
        {error && (
          <div className="alert-error">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-light">{error}</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-white/80 font-light mb-3 text-sm">
            Mensagem Criptografada
          </label>
          <textarea
            value={encrypted}
            onChange={(e) => setEncrypted(e.target.value)}
            className="input-field min-h-[120px] resize-none font-mono"
            placeholder="Cole aqui a mensagem criptografada..."
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-white/80 font-light mb-3 text-sm">
            Hash (Chave Privada)
          </label>
          <textarea
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            className="input-field min-h-[100px] resize-none font-mono text-sm"
            placeholder="Cole aqui o hash que foi gerado na criptografia..."
            required
            disabled={loading}
          />
          <p className="text-white/40 text-xs mt-2">
            ⚠️ O hash só pode ser usado uma única vez
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
              <span>Descriptografando...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              <span>Descriptografar</span>
            </div>
          )}
        </button>
      </form>

      {result && (
        <div className="mt-10 space-y-5 animate-fade-in">
          <div className="alert-success">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-light">Mensagem descriptografada com sucesso!</span>
            </div>
            <p className="text-white/70 text-xs ml-7 font-light">
              O hash foi marcado como usado e não pode mais ser utilizado.
            </p>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-light text-white">Mensagem Original</h3>
              <button
                onClick={() => copyToClipboard(result.decrypted)}
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
            
            <div className="bg-lavender/10 p-8 rounded-lg border border-lavender/20">
              <p className="text-white text-lg break-words font-light">{result.decrypted}</p>
            </div>
          </div>

          <div className="bg-lavender/10 border border-lavender/30 rounded-lg p-5">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-lavender flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-white font-light mb-1 text-sm">Sobre o Hash</p>
                <p className="text-white/70 text-xs font-light">
                  Este hash foi marcado como usado e não poderá mais ser utilizado para descriptografar mensagens.
                  Isso garante a segurança e evita reutilização de chaves.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-10 grid md:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-rose/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-light mb-1 text-sm">Uso Único</h3>
              <p className="text-white/60 text-xs font-light">Hash só pode ser usado uma vez</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-lavender/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-lavender" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-light mb-1 text-sm">Validação</h3>
              <p className="text-white/60 text-xs font-light">Verificação automática de hash</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-peach/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-peach" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-light mb-1 text-sm">Descriptografia</h3>
              <p className="text-white/60 text-xs font-light">Recuperação da mensagem</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Decrypt;

