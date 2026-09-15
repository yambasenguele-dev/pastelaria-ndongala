# Ndongala Sabor e Arte – Pastelaria

Website completo de vendas + Supabase para a pastelaria **Ndongala Sabor e Arte** (Prifina Maria Ndongala) em Luanda.

## Funcionalidades

- Cardápio com fotos reais + filtros
- Quantidade (− / +) + botão “Adicionar ao carrinho”
- Carrinho lateral + checkout
- Campo de localização
- Envio do pedido para WhatsApp **e** gravação no Supabase
- Botão flutuante do WhatsApp
- Ícones oficiais das redes sociais
- Painel admin (`admin.html`) para ver e actualizar status dos pedidos
- SEO avançado + marquee de comentários

## Como configurar o Supabase (passo a passo)

### 1. Criar projecto
1. Aceda a [https://supabase.com](https://supabase.com) e crie uma conta
2. Clique em **New Project**
3. Escolha um nome (ex: `ndongala`) e uma palavra-passe forte para a base de dados
4. Aguarde o projecto ser provisionado (~1–2 minutos)

### 2. Executar o schema
1. No menu lateral, vá a **SQL Editor**
2. Clique em **New query**
3. Abra o ficheiro `supabase-schema.sql` deste projecto
4. Copie todo o conteúdo e cole no editor
5. Clique em **Run** (ou Ctrl+Enter)

### 3. Obter as chaves
1. Vá a **Project Settings** → **API**
2. Copie:
   - **Project URL**
   - **anon public** key

### 4. Colar as chaves no código
Abra o ficheiro `js/supabase.js` e substitua:

```js
const SUPABASE_URL = 'https://xxxxxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 5. Testar
1. Abra `index.html` no navegador
2. Faça um pedido de teste
3. Abra `admin.html` para ver o pedido aparecer

## Estrutura de ficheiros

```
ndongala/
├── index.html              → Site público
├── admin.html              → Painel de pedidos
├── supabase-schema.sql     → Schema da base de dados
├── css/estilos.css
├── js/
│   ├── supabase.js         ← configurar aqui
│   ├── produtos.js
│   ├── carrinho.js
│   └── principal.js
└── imagens/
```

## Notas importantes

- Enquanto as chaves do Supabase não estiverem preenchidas, o site continua a funcionar normalmente (só envia para o WhatsApp).
- Em produção recomenda-se proteger o painel admin com autenticação (login).
- Os produtos actualmente estão no ficheiro `js/produtos.js`. Mais tarde podem ser migrados para a tabela `produtos` do Supabase.

## Contacto do negócio

- WhatsApp: **+244 972 893 829**
- Instagram / Facebook / TikTok (links no rodapé)

---
Desenvolvido com HTML, CSS, JavaScript puro + Supabase.
