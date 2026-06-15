# Plataforma Acadêmica Web Integrada ao Moodle

## 📚 Sobre o Projeto

A Plataforma Acadêmica Web Integrada ao Moodle é uma solução desenvolvida para modernizar a experiência acadêmica através de uma interface web mais intuitiva, comunicação em tempo real e integração transparente com o ambiente Moodle.

O projeto busca reduzir dificuldades encontradas em plataformas acadêmicas tradicionais, oferecendo uma experiência mais acessível, organizada e eficiente para alunos e professores.

---

## 🎯 Objetivo

Desenvolver uma plataforma complementar ao Moodle que facilite:

- Comunicação entre alunos e professores;
- Acompanhamento acadêmico;
- Organização das atividades educacionais;
- Acesso simplificado aos recursos acadêmicos.

---

## ✨ Principais Funcionalidades

- Autenticação integrada ao Moodle;
- Comunicação em tempo real;
- Interface moderna e responsiva;
- Gestão acadêmica centralizada;
- Integração transparente com o ambiente Moodle;
- Atualização instantânea de informações.

---

## 🏗️ Arquitetura

### Frontend

- React
- React Router DOM
- Axios
- React Icons

### Backend

- Node.js
- Express.js
- Socket.IO

### Banco de Dados

- PostgreSQL

### Comunicação

- WebSocket (Socket.IO)
- API REST

---

## 🔄 Fluxo de Funcionamento

1. O usuário realiza login na plataforma.
2. O backend valida as credenciais.
3. Os dados acadêmicos são obtidos através da integração com o Moodle.
4. As informações são disponibilizadas na interface web.
5. Eventos e mensagens são atualizados em tempo real utilizando Socket.IO.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Função |
|------------|---------|
| React | Interface do usuário |
| Node.js | Servidor Backend |
| Express.js | API REST |
| PostgreSQL | Banco de Dados |
| Socket.IO | Comunicação em tempo real |
| Moodle | Ambiente Virtual de Aprendizagem |

---

## 📈 Benefícios Esperados

- Melhor organização acadêmica;
- Maior engajamento dos alunos;
- Comunicação mais eficiente;
- Redução da complexidade das interfaces tradicionais;
- Centralização das informações acadêmicas.

---

## 🚀 Instalação

### Clonar o repositório

```bash
git clone https://github.com/seu-usuario/plataforma-academica.git
cd plataforma-academica
```

### Backend

```bash
cd backend

npm install

npm run dev
```

### Frontend

```bash
cd frontend

npm install

npm start
```

---

## 📂 Estrutura do Projeto

```text
plataforma-academica/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── package.json
│
├── database/
│   └── scripts/
│
└── README.md
```

---

## 👨‍💻 Equipe de Desenvolvimento

- Guilherme Rodrigues dos Santos Filho
- Gustavo Antonio Souza Lima
- Pedro Augusto Biano

### Orientadores

- Ronildo Aparecido Ferreira
- Luciana Ferreira Baptista

---

## 🎓 Trabalho de Conclusão de Curso

Projeto desenvolvido como Trabalho de Conclusão de Curso (TCC) do curso Técnico em Desenvolvimento de Sistemas da ETEC.

---

## 📄 Licença

Este projeto possui finalidade acadêmica e educacional.
