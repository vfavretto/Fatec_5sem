import * as SQLite from 'expo-sqlite';

async function Createbank() {
    //Criar banco de dados
    try {
        const db = await SQLite.openDatabaseAsync('Sqlreact.db');
        console.log('Banco de dados criado com sucesso');
        return db;
    } catch (error) {
        console.log('Erro ao criar banco de dados' + error);
    }
}

export default Createbank;