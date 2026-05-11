# Sistema Web para Gestão Acadêmica e Interação entre Alunos e Professores

Plataforma web de colaboração acadêmica, desenvolvida especificamente para o ambiente escolar e universitário. O sistema integra comunicação, organização de turmas, gerenciamento de trabalhos, entregas e acompanhamento de desempenho em um único ambiente.

## Objetivo

Criar um ambiente digital que permita a professores, alunos e instituições educacionais organizar disciplinas, comunicar-se em tempo real e gerenciar atividades acadêmicas de forma estruturada e centralizada.

---

# Funcionalidades Principais

## Autenticação e Usuários

* Cadastro de usuários
* Login seguro com autenticação JWT
* Perfis de acesso:

  * Aluno
  * Professor
  * Coordenador

## Gestão de Turmas

* Criação de disciplinas/turmas
* Matrícula de alunos
* Associação de professores
* Organização automática de canais por turma

## Comunicação

* Chat em tempo real
* Canais de comunicação por disciplina
* Mensagens persistidas em banco de dados

## Trabalhos e Avaliações

* Criação de atividades
* Upload de trabalhos pelos alunos
* Sistema de notas
* Feedback dos professores

## Calendário Acadêmico

* Datas de entrega
* Eventos e provas
* Organização de atividades por disciplina

## Videochamadas

* Integração com sistema de videoconferência
* Salas de reunião por turma

---

# Arquitetura do Sistema

Frontend → API → Banco de Dados
      ↘ WebSocket (Chat em tempo real)
      ↘ Servidor de videoconferência

O sistema é dividido em três camadas principais:

* Frontend (interface do usuário)
* Backend (API e lógica de negócio)
* Banco de dados (armazenamento persistente)

---

# Tecnologias Utilizadas

## Frontend

* React
* Bootstrap
* Axios

## Backend

* ASP.NET Core Web API
* Entity Framework Core
* SignalR (comunicação em tempo real)
* JWT Authentication
* BCrypt (hash de senha)

## Banco de Dados

* PostgreSQL

## Armazenamento de Arquivos

* AWS S3 ou Cloudinary

## Videoconferência

* Jitsi Meet

---

# Estrutura do Projeto

```
backend/
│
├── Controllers
├── Services
├── Repositories
├── Models
├── DTOs
├── Data
└── Hubs

frontend/
│
├── components
├── pages
├── services
└── styles
```

---

# Modelo de Dados (Resumo)

## Users

* id
* name
* email
* password_hash
* role

## Classes

* id
* name
* semester
* professor_id

## Enrollments

* student_id
* class_id

## Channels

* id
* class_id
* type

## Messages

* id
* channel_id
* user_id
* content
* created_at

## Assignments

* id
* class_id
* title
* description
* due_date

## Submissions

* id
* assignment_id
* student_id
* file_url
* grade
* feedback

---

# Segurança

* Autenticação baseada em JWT
* Senhas protegidas com BCrypt
* Controle de acesso por roles
* Comunicação segura via HTTPS
* Validação de dados na API

---

# Instalação

## Backend

```
git clone https://github.com/seuusuario/seuprojeto.git

cd backend

dotnet restore

dotnet run
```

## Frontend

```
cd frontend

npm install

npm start
```

---

# Roadmap

Funcionalidades planejadas:

* Dashboard de desempenho acadêmico
* Notificações em tempo real
* Sistema de analytics educacional
* Aplicativo mobile
* Integração com sistemas institucionais

---

# Contribuição

Contribuições são bem-vindas. Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas alterações
4. Abra um Pull Request

---

# Licença

Este projeto está licenciado sob a licença MIT.

---

# Autor

Projeto desenvolvido para estudo e desenvolvimento de uma plataforma de colaboração acadêmica moderna.
