# Algo Shorts

Visualizações de algoritmos que você controla. A ideia nasceu daqueles vídeos de
_sorting_ que viralizam em shorts e reels — barras coloridas dançando ao som de
bipes — mas aqui você não só assiste: dá play, pausa, avança passo a passo, troca
a velocidade e escolhe o algoritmo. Cada etapa é narrada por um guia que explica,
em linguagem humana, o que está acontecendo e por quê.

**Ver ao vivo:** [algoshorts.netlify.app](https://algoshorts.netlify.app)

Projeto de portfólio. O objetivo não é a quantidade de algoritmos, e sim a camada
que fica no meio: uma engine que separa a lógica da renderização de forma limpa o
bastante pra que adicionar um algoritmo novo seja escrever uma função e
registrá-la.

## O que tem dentro

- **A família dos shorts.** Ordenação (Bubble, Insertion, Selection, Merge, Quick,
  Heap, Shell e o meme Bogo), busca (linear e binária) e pathfinding numa grade
  (BFS, DFS, Dijkstra e A\*).
- **Passo a passo narrado.** Um personagem-guia comenta cada comparação, troca e
  decisão. Ao final, a complexidade Big-O e uma curiosidade sobre o algoritmo.
- **Áudio-assinatura.** Cada barra toca um tom proporcional ao seu valor; no fim,
  a varredura que confirma a ordenação. É o que faz esses vídeos viciarem, e aqui
  dá pra ligar e desligar.
- **Vários modos de visualização.** As mesmas barras podem virar arco-íris, pontos
  ou um anel — a mesma execução, ângulos diferentes.
- **Modo corrida.** Dois algoritmos lado a lado no mesmo array embaralhado, pra
  sentir na hora quem é mais rápido.
- **Três idiomas e dois temas.** Português, inglês e espanhol; claro e escuro, com
  a preferência lembrada entre visitas.

## A engine

O centro do projeto. Cada algoritmo é um conector que implementa o mesmo
contrato: recebe uma entrada e devolve uma lista de `Move` — eventos atômicos como
comparar, trocar ou marcar. O player dobra essa lista num `Frame` por vez,
mantendo um único array de trabalho. Nada de guardar uma cópia do array por passo:
a memória cresce com o número de eventos, não com passos vezes tamanho, e a coisa
escala pra centenas de barras e milhares de passos.

Cada `Move` carrega uma nota estruturada (uma chave e seus valores). A engine não
sabe de idioma nenhum — quem transforma a nota em fala do personagem é a camada de
i18n. Trocar de língua troca a narração inteira sem tocar na lógica.

```
entrada ──► algoritmo.generate() ──► Move[] ──► player ──► Frame ──► viz
                                        │
                                     Note (i18n) ──► fala do personagem
```

Plugar um algoritmo novo é o mesmo movimento de sempre: escrever a lógica em
`src/lib/algorithms`, registrar no índice, pronto.

## Stack

Next.js (App Router) e TypeScript, Tailwind CSS para o estilo, Framer Motion para
as animações, next-themes para claro e escuro. Sem backend: tudo roda no cliente.

## Rodando local

```bash
pnpm install
pnpm dev
```

Abre em `http://localhost:3000`. Para o build de produção:

```bash
pnpm build
pnpm start
```

## Estrutura

```
src/
  app/                 rotas (home e a página de cada algoritmo)
  components/
    viz/               os modos de visualização (barras, arco-íris, pontos, anel)
    player/            player, controles, personagem e áudio
  lib/
    engine/            tipos Move e Note, o player e o registry
    algorithms/        a lógica de cada algoritmo, um arquivo por algoritmo
    i18n/              dicionários pt, en, es e a narração
```
