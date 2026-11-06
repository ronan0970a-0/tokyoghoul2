# Fichas — React + Vite + Supabase

Mesma ficha de antes, agora em React. Usa a **mesma tabela e o mesmo formato de dados**, então as fichas já criadas continuam funcionando.

## Estrutura
- `src/App.jsx` — login, tema, personagens e salvamento automático
- `src/Screens.jsx` — telas de login e lista de personagens
- `src/Sheet.jsx` — a ficha (abas, status, listas com foto, NPCs fixados)
- `src/data.js` — campos, abas e regras por categoria (edite aqui para mudar campos)
- `src/styles.css` — temas Ghoul / CCG / Humano

## Rodar local
1. `npm install`
2. Copie `.env.example` para `.env` e preencha com a URL e a anon key do Supabase.
3. `npm run dev`

## Supabase
Rode `schema.sql` no SQL Editor (se ainda não rodou). Em Authentication > URL Configuration, ponha a URL do Vercel em Site URL.

## Vercel
Suba a pasta no GitHub e importe no Vercel (preset Vite, detectado sozinho).
Em Settings > Environment Variables, crie `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

## Modo mestre
1. Rode o `schema.sql` (a parte "MESTRE" cria a função `is_master`, os perfis e as políticas).
2. Torne alguém mestre trocando o e-mail e rodando a última linha comentada do `schema.sql` (a conta precisa já existir).
3. Ao entrar, o mestre vê "Minhas fichas" e "Todas as fichas (mestre)": busca por personagem/jogador, abrir e editar qualquer ficha. Excluir continua só para o dono.
