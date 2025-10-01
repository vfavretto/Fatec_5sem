const express = require('express');
const router = express.Router();
const axios = require('axios');
const Endereco = require('../models/Endereco');

// Buscar CEP na API ViaCEP
router.get('/buscar-cep/:cep', async (req, res) => {
  try {
    const { cep } = req.params;
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      return res.status(400).json({ error: 'CEP inválido' });
    }

    const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    
    if (response.data.erro) {
      return res.status(404).json({ error: 'CEP não encontrado' });
    }

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar CEP', details: error.message });
  }
});

// CREATE - Criar novo endereço
router.post('/', async (req, res) => {
  try {
    const endereco = new Endereco(req.body);
    await endereco.save();
    res.status(201).json(endereco);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar endereço', details: error.message });
  }
});

// READ - Listar todos os endereços
router.get('/', async (req, res) => {
  try {
    const enderecos = await Endereco.find().sort({ createdAt: -1 });
    res.json(enderecos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar endereços', details: error.message });
  }
});

// READ - Buscar endereço por ID
router.get('/:id', async (req, res) => {
  try {
    const endereco = await Endereco.findById(req.params.id);
    if (!endereco) {
      return res.status(404).json({ error: 'Endereço não encontrado' });
    }
    res.json(endereco);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar endereço', details: error.message });
  }
});

// UPDATE - Atualizar endereço
router.put('/:id', async (req, res) => {
  try {
    const endereco = await Endereco.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!endereco) {
      return res.status(404).json({ error: 'Endereço não encontrado' });
    }
    
    res.json(endereco);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar endereço', details: error.message });
  }
});

// DELETE - Deletar endereço
router.delete('/:id', async (req, res) => {
  try {
    const endereco = await Endereco.findByIdAndDelete(req.params.id);
    
    if (!endereco) {
      return res.status(404).json({ error: 'Endereço não encontrado' });
    }
    
    res.json({ message: 'Endereço deletado com sucesso', endereco });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar endereço', details: error.message });
  }
});

module.exports = router;

