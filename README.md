# Brev-ly

Brev-ly é um encurtador de links. Este projeto tem como objetivo uma aplicação que permita o cadastro,
listagem e remoção de links encurtados, geração de relatório dos acessos de cada links e também o
redirecionamento correto do link encurtado para o link original.

---

## Índice

- [Arquitetura / Tecnologias](#arquitetura--tecnologias)
- [Instalação e Uso](#instalação-e-uso)
  - [Pré-requisitos](#pré-requisitos)
  - [Configurando Ambiente](#configurando-ambiente)
  - [Rodando localmente](#rodando-localmente)
  - [Rodando os teste](#rodando-os-testes)

---

## Instalação e Uso

### Pré-requisitos

Antes de começar, certifique-se de ter:

- Node.js instalado (versão recomendada: **22.16** ou superior)
- [pnpm](https://pnpm.io/)
- Conta Cloudflare com R2 habilitado
- Pulumi instalado e configurado com credenciais (para provisionar infraestrutura)
- Docker

### Configurando Ambiente

1. Clonar este repositório:

   ```bash
   git clone https://github.com/MuriloMorandi/widget-upload.git
   cd widget-upload
   ```

2. Instale dependências (frontend e backend):

   ```bash
   cd web
   pnpm install

   cd ../server
   pnpm install
   ```

3. Configure variáveis de ambiente necessárias:

   Crie o `.env` com base no `server/.env.example` adicionando suas credenciais ee configurações

   ```bash
    #/server/.env.example
    PORT=
    DATABASE_URL=

    CLOUDFLARE_ACCOUNT_ID=""
    CLOUDFLARE_ACCESS_KEY_ID=""
    CLOUDFLARE_SECRET_ACCESS_KEY=""
    CLOUDFLARE_BUCKET=""
    CLOUDFLARE_PUBLIC_URL=""
   ```

4. Inicie os serviços localmente no Docker

   ```bash
   # inicializar o container docker
   cd server
   docker compose up -d

   # Roda as migrations do banco de dados
   pnpm run db:migrate
   ```

### Rodando localmente

1. Rode frontend e backend separadamente:

   ```bash
   # backend
   cd server
   pnpm run dev

   # frontend
   cd web
   pnpm run dev
   ```

### Rodando os testes

1. Rodando os testes

   ```bash
   # backend
   cd server
   pnpm run test
   ```
