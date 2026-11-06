# Fichas — React + Vite + Supabase

Mesma ficha de antes, agora em React. Usa a **mesma tabela e o mesmo formato de dados**, então as fichas já criadas continuam funcionando.

## Estrutura
- `src/App.jsx` — login, tema, personagens e salvamento automático
- `src/Screens.jsx` — telas de login e lista de personagens
- `src/Sheet.jsx` — a ficha (abas, status, listas com foto, NPCs fixados)
- `src/GhoulCard.jsx` — cartão de apresentação do Ghoul (imagem em `src/assets/ghoul-card.jpg`; usa nome, nome em japonês, nascimento, tipo de Kagune e foto 1)
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
2. O `schema.sql` já registra `anthonyacbb22@gmail.com` como mestre (a conta precisa já existir; se criar depois, rode o `mestre.sql`). Para outro mestre, troque o e-mail no `mestre.sql`.
3. Ao entrar, o mestre vê "Minhas fichas" e "Todas as fichas (mestre)": busca por personagem/jogador, abrir, editar e excluir qualquer ficha.
