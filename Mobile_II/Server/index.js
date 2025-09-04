const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// Configurar conexão com MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mobile2");
    console.log("Conexão com o MongoDB estabelecida com sucesso!");
  } catch (error) {
    console.log("Erro na conexão com o MongoDB:", error.message);
    process.exit(1);
  }
};
connectDB();

var UserSchema = new mongoose.model("User", { nome: String });
const user = new UserSchema({ nome: "Jorge" });

// get all users
app.get("/", async (req, res) => {
  const users = await UserSchema.find();
  res.json(users);
});

app.post("/inserir", async (req, res) => {
  try {
    const { nome } = req.body;
    const novoUsuario = new UserSchema({ nome });
    await novoUsuario.save();
    res.status(201).json({
      status: "success",
      message: "Usuário inserido com sucesso!",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Erro ao inserir usuário",
      error: error.message,
    });
  }
});

// deletar usuário por ID
app.delete("/deletar/:id", async (req, res) => {
  const { id } = req.params;
  await UserSchema.deleteOne({ _id: id });
  res.status(200).json({
    status: "success",
    message: "Usuário deletado com sucesso!",
  });
});

// Alterar dados
app.put("/alterar/:id", async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  await UserSchema.updateOne({ _id: id }, { nome });
  res.status(200).json({
    status: "success",
    message: "Usuário alterado com sucesso!",
  });
});

// get by id
app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await UserSchema.findById(id);
  res.json(user);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
