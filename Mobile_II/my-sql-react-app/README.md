# Biblioteca de Livros (MongoDB / SQLite)

Aplicativo Expo com backend Node/Express que permite cadastrar livros concluídos ou planejados, escolhendo o banco de dados (MongoDB ou SQLite) já na tela de abertura.

## Requisitos

- Node.js 18+
- MongoDB (opcional, caso deseje testar o modo `mongo`)

## Configuração de ambiente

1. Duplique o arquivo `.env.example` para `.env` (frontend e backend usam o mesmo arquivo de variáveis públicas):

   ```bash
   cp .env.example .env
   ```

2. Ajuste os valores conforme seu ambiente:

   - `MONGO_URI`: string de conexão com o MongoDB.
   - `SQLITE_PATH`: caminho para o arquivo SQLite. Por padrão, `backend/data/books.sqlite`.
   - `PORT`: porta do servidor Express. Padrão `3333`.
   - `EXPO_PUBLIC_API_URL`: URL base do backend acessível pelo aplicativo (ex.: `http://192.168.0.xxx:3333` quando testar no dispositivo).

## Executando o backend

```bash
cd backend
npm install        # primeira vez
npm run dev        # desenvolvimento com recarga automática
```

### Endpoints principais (`/api/books?db=sqlite|mongo`)

- `GET /api/books` – lista livros.
- `POST /api/books` – cria um livro (`titulo`, `autor`, `status`, `nota?`).
- `GET /api/books/:id` – busca um livro específico.
- `PUT /api/books/:id` – atualiza um livro.
- `DELETE /api/books/:id` – remove um livro.

Sempre inclua a query `db` com o valor desejado (`sqlite` por padrão quando omitida).

## Executando o aplicativo Expo

```bash
npm install        # primeira vez
npm start
```

Na primeira execução você verá a tela de splash solicitando a escolha do banco. A seleção é salva com `AsyncStorage`, podendo ser redefinida pelo botão “Trocar banco” na tela principal.

## Estrutura resumida

- `backend/`: servidor Express com serviços específicos para MongoDB e SQLite.
- `src/`: app Expo (Context API para seleção do banco, tela de splash e CRUD de livros).
- `.env.example`: variáveis compartilhadas frontend/backend (duplique para `.env`).

