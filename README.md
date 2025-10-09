# Brev-ly

<div align="center">
  <img src="web\public\logo_icon.svg" alt="Logo" width="100" />
</div>

Brev-ly é um encurtador de links. Este projeto tem como objetivo uma aplicação que permita o cadastro,
listagem e remoção de links encurtados, geração de relatório dos acessos de cada links e também o
redirecionamento correto do link encurtado para o link original.

## Índice

- [Instalação e Uso](#instalação-e-uso)
  - [Pré-requisitos](#pré-requisitos)
  - [Configurando Ambiente](#configurando-ambiente)
  - [Rodando localmente](#rodando-localmente)
  - [Rodando os teste](#rodando-os-testes)


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

   - **Servidor (backend):**  
     Crie o arquivo `.env` na pasta `server/` com base no `server/.env.example`, adicionando suas credenciais e configurações:

     ```bash
     # server/.env
     PORT=
     DATABASE_URL=

     CLOUDFLARE_ACCOUNT_ID=""
     CLOUDFLARE_ACCESS_KEY_ID=""
     CLOUDFLARE_SECRET_ACCESS_KEY=""
     CLOUDFLARE_BUCKET=""
     CLOUDFLARE_PUBLIC_URL=""
     ```

   - **Frontend:**  
     Crie o arquivo `.env` na pasta `web/` com base no `web/.env.example`:

     ```bash
     # web/.env
     VITE_API_URL=
     ```

4. Inicie os serviços localmente no Docker e executar as migrations

   - Inicie os serviços necessários em segundo plano com o Docker:
      ```bash
      cd server
      docker compose up -d
      ```
   - Após os containers estarem em execução, rode as migrations para aplicar as alterações no banco de dados:
      ```bash
      pnpm run db:migrate
      ```

### Rodando localmente

1. Rode frontend e backend separadamente:

   - **Servidor (backend):**  
      ```bash
      cd server
      pnpm run dev
       ```

   - **Frontend:**  
      ```bash
      cd web
      pnpm run dev
      ```

### Rodando os testes

- **Servidor (backend):**  
   ```bash
   cd server
   pnpm run test
   ```
