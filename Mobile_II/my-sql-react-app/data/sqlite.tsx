import * as SQLite from 'expo-sqlite';

async function createDatabase() {
    //Criar banco de dados
    try {
        const db = await SQLite.openDatabaseAsync('Sqlreact.db');
        console.log('Banco de dados criado com sucesso');
        return db;
    } catch (error) {
        console.log('Erro ao criar banco de dados' + error);
    }
}

async function createTable(database: SQLite.SQLiteDatabase) {
    try {
        await database.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(100),
                email VARCHAR(100)
            )
        `);
    } catch (error) {
        console.log('Erro ao criar tabela' + error);
    }
    console.log('Tabela criada com sucesso');
}

async function insertData(database: SQLite.SQLiteDatabase, name: string, email: string) {
    try {
        await database.runAsync(`
            INSERT INTO users (name, email) VALUES (?, ?)
        `, [name, email]);
    } catch (error) {
        console.log('Erro ao inserir dados' + error);
    }
    console.log('Dados inseridos com sucesso');
}

async function selectData(database: SQLite.SQLiteDatabase) {
    try {
        const result = await database.execAsync(`SELECT * FROM users`);
        console.log(result);
    } catch (error) {
        console.log('Erro ao selecionar dados' + error);
    }
}

export { createTable, insertData };
export default createDatabase;