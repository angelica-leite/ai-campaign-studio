# AI Campaign Studio

Projeto de estudo fullstack com React, TypeScript, Python, FastAPI e SQLite.

## Funcionalidades

- Cadastrar campanhas.
- Listar campanhas salvas no banco.
- Simular uma solicitação de vídeo alterando o status da campanha.

A simulação não gera arquivos de vídeo nem utiliza um modelo de IA.

## Executar o backend

No PowerShell:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload
```

Documentação da API: http://127.0.0.1:8000/docs

## Executar o frontend

Em outro terminal:

```powershell
cd frontend
npm install
npm run dev
```

Interface: http://localhost:5173

O banco SQLite é criado automaticamente ao iniciar o backend.
