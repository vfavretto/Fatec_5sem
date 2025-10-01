const mongoose = require('mongoose');

const enderecoSchema = new mongoose.Schema({
  cep: {
    type: String,
    required: true,
    trim: true
  },
  logradouro: {
    type: String,
    required: true
  },
  complemento: {
    type: String,
    default: ''
  },
  bairro: {
    type: String,
    required: true
  },
  localidade: {
    type: String,
    required: true
  },
  uf: {
    type: String,
    required: true
  },
  numero: {
    type: String,
    default: ''
  },
  observacoes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Endereco', enderecoSchema);

