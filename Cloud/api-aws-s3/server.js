require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer'); // faltava importar
 
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: '*'
}));
 
//swagger
const swaggerDocs = require('./swagger');
//S3
const AWS = require('aws-sdk');
 
//#region S3
AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    sessionToken: process.env.SESSION_TOKEN
});
 
const s3 = new AWS.S3();
 
/**
 * @swagger
 * /buckets:
 *   get:
 *     summary: Lista todos os buckets
 *     tags:
 *       - Buckets
 *     responses:
 *       200:
 *         description: Lista de todos os buckets
 */
app.get('/buckets', async (req, res) => {
    try {
        const result = await s3.listBuckets().promise();
        res.status(200).json(result.Buckets);
    } catch (error) {
        console.log("Erro ao buscar buckets", error);
        res.status(500).json({ error: 'Erro ao listar buckets', details: error });
    }
});
 
/**
 * @swagger
 * /buckets/{bucketName}:
 *   get:
 *     summary: Lista os objetos de um bucket
 *     tags:
 *       - Buckets
 *     parameters:
 *       - in: path
 *         name: bucketName
 *         required: true
 *         description: Nome do bucket
 *     responses:
 *       200:
 *         description: Lista dos objetos do bucket
 */
app.get('/buckets/:bucketName', async (req, res) => {
    try {
        const { bucketName } = req.params;
        const result = await s3.listObjectsV2({ Bucket: bucketName }).promise();
        res.status(200).json(result.Contents);
    } catch (error) {
        console.log("Erro ao buscar objetos", error);
        res.status(500).json({ error: 'Erro ao listar objetos do bucket', details: error });
    }
});
 
/**
 * @swagger
 * /buckets/{bucketName}/upload:
 *   post:
 *     summary: Faz o upload de um arquivo para um bucket
 *     tags:
 *       - Buckets
 *     parameters:
 *       - in: path
 *         name: bucketName
 *         required: true
 *         description: Nome do bucket
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Arquivo enviado com sucesso
 */
// Configuração do multer para armazenar em memória
const upload = multer({ storage: multer.memoryStorage() });
 
app.post('/buckets/:bucketName/upload', upload.single('file'), async (req, res) => {
    try {
        const { bucketName } = req.params;
        const file = req.file;
 
        const params = {
            Bucket: bucketName,
            Key: Date.now().toString() + "-" + file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
 
        const result = await s3.upload(params).promise();
 
        res.status(200).json({
            message: 'Upload efetuado com sucesso!',
            fileUrl: result.Location
        });
    } catch (error) {
        console.log('Erro ao efetuar upload', error);
        res.status(500).json({ message: 'Erro no upload', error: error.message });
    }
});
 
/**
 * @swagger
 * /buckets/{bucketName}/file/{fileName}:
 *   delete:
 *     summary: Deleta um arquivo específico de um bucket
 *     tags:
 *       - Buckets
 *     parameters:
 *       - in: path
 *         name: bucketName
 *         required: true
 *         description: Nome do bucket
 *       - in: path
 *         name: fileName
 *         required: true
 *         description: Nome do arquivo a ser deletado
 *     responses:
 *       200:
 *         description: Arquivo deletado com sucesso
 */
app.delete('/buckets/:bucketName/file/:fileName', async (req, res) => {
    try {
        const { bucketName, fileName } = req.params;
 
        await s3.deleteObject({
            Bucket: bucketName,
            Key: fileName
        }).promise();
 
        res.status(200).json({ message: `Arquivo ${fileName} removido com sucesso!` });
    } catch (error) {
        console.log("Erro ao remover objeto", error);
        res.status(500).json({ error: 'Erro ao remover objeto', details: error });
    }
});
//#endregion
 
swaggerDocs(app);
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));