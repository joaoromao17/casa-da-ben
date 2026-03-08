

# Redesign Completo — ICB 610 Landing Page

## Visão Geral

Redesign completo do site institucional da ICB 610 com foco em: identidade visual coesa (paleta quente com bege/champagne sutil), mobile-first, microinterações elegantes, hierarquia de CTAs clara, e criação de 6 novas páginas estáticas. O site passará de "funcional mas genérico" para "institucional premium, acolhedor e intencional".

---

## 1. Sistema de Design — Paleta e Tipografia

### tailwind.config.ts
- Adicionar cores warm: `warm-50` a `warm-900` (tons bege/champagne) como cor de apoio
- Redefinir `church-gold` para um dourado sutil real (`#C9A96E` / `#D4B483`)
- Adicionar keyframes: `fade-up`, `stagger`, `slow-zoom`, `slide-up`
- Adicionar utilitários de animação correspondentes

### src/index.css
- Ajustar CSS variables para tons mais quentes nos cinzas
- Adicionar classes utilitárias: `.section-padding` (py consistente), `.heading-display` (tipografia forte), `.text-body` (largura de leitura max-w-prose)
- Scroll suave global (`scroll-behavior: smooth`)
- Refinar scrollbar com tons warm
- Adicionar `.animate-fade-up` e `.animate-stagger` classes

---

## 2. Layout e Navbar

### src/components/layout/Navbar.tsx — Reescrever
- **Sticky** com transição: fundo branco → ao rolar, `bg-white/80 backdrop-blur-md shadow-sm`
- Logo levemente maior (~90px)
- Links com hover underline animado (usando `after:` pseudo-element)
- CTA destacado no header: botão "Visite-nos" com estilo warm/gold
- Mobile: hamburger menu com overlay fullscreen elegante (fade-in, links grandes, espaçados, fáceis de tocar)
- Instagram no desktop mantido mas com estilo mais sutil

### src/components/layout/Layout.tsx
- Sem mudanças estruturais

### src/components/layout/Footer.tsx — Reescrever
- Fundo `church-800` mais refinado com melhor espaçamento
- Grid 3 colunas (desktop), stack (mobile)
- Links rápidos expandidos: incluir novas páginas (Primeira Visita, No que Cremos, etc.)
- Email com `truncate` ou wrap elegante
- Logo branco com tamanho mais proporcional
- Adicionar link WhatsApp/Instagram mais visíveis
- Copyright e links legais com melhor hierarquia
- Remover seção "Apoiar Desenvolvedor" do footer principal (mover para links legais)

---

## 3. Home — Redesign Completo

### src/pages/Home.tsx — Reescrever

**Seção 1: Hero**
- Overlay com gradiente mais sofisticado (radial + linear, warm tones)
- Imagem com `animate-slow-zoom` sutil (scale 1→1.05 em 20s)
- Tipografia display maior no título, tracking mais apertado
- Subtítulo com tipografia mais leve/itálica
- CTA primário: "Visite-nos" (fundo warm-gold, texto escuro)
- CTA secundário: "Ver Horários" (outline branco elegante)
- Max-width no bloco de texto

**Seção 2: Info Bar (NOVA)**
- Bloco logo abaixo do hero com 3 colunas: Endereço | Próximo Culto (Domingo 18h30) | Como Chegar (link maps)
- Fundo `warm-50`, borda sutil, ícones refinados
- Mobile: stack vertical com divisores

**Seção 3: Bem-vindo à Família**
- Grid 2 colunas mais refinado
- Imagem com `rounded-2xl shadow-xl` e leve rotação decorativa ou borda warm
- Texto com max-width para leitura confortável
- Adicionar 3 highlights escaneáveis com ícones: "Ambiente acolhedor", "Cultos semanais", "Família para pertencer"
- CTA: "Conheça Nossa História"
- Fade-up animation nas entradas

**Seção 4: Palavra para Você (substitui Versículo do Dia)**
- Novo componente inspiracional/editorial
- Título: "Uma palavra para você"
- Citação em tipografia serif/display grande, itálica
- Referência bíblica com destaque
- Texto pastoral curto introdutório
- Fundo `warm-50` com bastante respiro
- Remover VerseCard widget-like

**Seção 5: Nossos Cultos**
- Fundo escuro mais sofisticado (`church-800` com overlay sutil warm)
- Cards com fundo `church-700/60`, bordas warm sutis, mais padding
- Ícones por tipo de culto (cruz, mãos orando, livro, corrente)
- Domingo em destaque (card maior ou badge "Culto Principal")
- Microdescrições: "Culto principal da semana", "Momento de oração", etc.
- CTA: "Como Chegar" em branco

**Seção 6: Primeira Visita — Preview (NOVO)**
- Bloco com fundo warm-50
- Título: "Primeira vez na ICB 610?"
- 3-4 bullets curtos respondendo perguntas comuns
- CTA: "Saiba mais sobre sua primeira visita"
- Link para nova página /primeira-visita

**Seção 7: Instagram / Vida da Igreja**
- Grid 2x2 ou 3 colunas com fotos reais da igreja (galeria existente)
- Título: "A vida na ICB 610"
- Subtítulo: "Acompanhe nosso dia a dia no Instagram"
- CTA: botão Instagram estilizado na paleta (sem gradiente roxo/rosa)
- Remover screenshot do perfil

**Seção 8: CTA Final**
- Fundo com imagem da igreja + overlay warm escuro
- Título: "Sua primeira visita começa aqui"
- Texto emocional curto
- CTA primário: "Como Chegar" (botão warm-gold)
- CTA secundário: "Fale Conosco"

---

## 4. Sobre — Redesign

### src/pages/Sobre.tsx — Reescrever

- **Hero**: overlay mais sofisticado, tipografia maior
- **Tabs**: maiores, com estado ativo mais evidente (borda inferior warm-gold, fonte bold), mobile-friendly
- **História**: transformar em timeline visual com marcos (1992 Fundação → mudanças → construção templo → Pastor Marcial 2006). Blocos alternados com anos em destaque
- **Missão/Visão/Valores**: 3 cards independentes com ícones, fundo warm-50, bordas sutis
- **Galeria**: grid mais refinado com hover zoom, possibilidade de lightbox (dialog overlay ao clicar)
- **Localização**: melhor layout, CTA Google Maps mais destacado
- **CTA final**: consistente com Home

---

## 5. Cultos — Redesign

### src/pages/Cultos.tsx — Reescrever

- Hero com imagem de fundo (pode reusar banner ou foto da igreja)
- Cards maiores e mais bonitos com ícones, microdescrições, fundo warm-50
- Domingo em destaque com badge ou tamanho diferenciado
- Seção final com convite humano e CTA "Como Chegar" + "Fale Conosco"

---

## 6. Contato — Redesign

### src/pages/Contato.tsx — Reescrever

- Hero com imagem
- Cards de contato refinados: Instagram, Google Maps, Email com hierarquia clara
- Foto da igreja com tratamento premium (rounded, shadow, crop)
- Mapa melhor integrado
- Seção FAQ mantida mas com estilo accordion refinado
- CTA final consistente

---

## 7. Novas Páginas Estáticas

### src/pages/PrimeiraVisita.tsx (NOVA)
- Hero acolhedor
- FAQ visual: "Como é um culto?", "O que vestir?", "Posso ir com crianças?", "Precisa agendar?", "Quanto tempo dura?", "Onde sentar?", "Todos são bem-vindos?"
- Cards ou accordion com ícones
- CTA: Como Chegar + Ver Horários

### src/pages/QuemEJesus.tsx (NOVA)
- Página evangelística emocional
- Tipografia editorial bonita
- Versículos destacados
- Seções: Quem é Jesus, O que Ele fez, Por que isso importa, Como começar
- CTA: Visite-nos / Fale Conosco

### src/pages/NoQueCremos.tsx (NOVA)
- Página doutrinária institucional
- Cards ou blocos organizados por crença
- Baseado em crenças comuns evangélicas (Bíblia, Trindade, Salvação, etc.)
- Tom sóbrio e confiável

### src/pages/Lideranca.tsx (NOVA)
- Espaço para foto do pastor e breve apresentação
- Usar dados existentes (Pastor Marcial)
- Tom acolhedor com mensagem pastoral curta

### src/pages/Ministerios.tsx (NOVA — versão estática)
- Cards estáticos: Louvor, Crianças, Jovens, Mulheres, Oração
- Sem dados inventados específicos; descrições genéricas mas coerentes
- Visual consistente com o restante

### src/pages/ComoChegar.tsx (NOVA)
- Foco total em ajudar o visitante novo
- Mapa grande, endereço claro, ponto de referência, estacionamento, transporte
- CTA Google Maps muito destacado

---

## 8. Rotas — App.tsx

Adicionar rotas:
- `/primeira-visita` → PrimeiraVisita
- `/quem-e-jesus` → QuemEJesus
- `/no-que-cremos` → NoQueCremos
- `/lideranca` → Lideranca
- `/ministerios` → Ministerios (versão estática)
- `/como-chegar` → ComoChegar

---

## 9. Mobile CTA Flutuante

### Novo componente: src/components/ui/MobileFloatingCTA.tsx
- Barra fixa no rodapé (mobile only)
- 2 botões: "Como Chegar" (Google Maps) + "Instagram"
- Aparece após scroll do hero
- Elegante, discreto, `backdrop-blur` com sombra sutil
- Incluído no Layout.tsx

---

## 10. Componentes Reutilizáveis Novos

- `src/components/ui/SectionHeading.tsx` — título + subtítulo padronizado com fade-up
- `src/components/ui/PageHero.tsx` — hero reutilizável para todas as páginas internas
- `src/components/ui/InfoBar.tsx` — bloco de 3 infos rápidas (usado na Home)
- `src/components/ui/ServiceCard.tsx` — card de culto refinado com ícone e microdesc
- `src/components/ui/FeatureHighlight.tsx` — highlights escaneáveis (ícone + texto curto)

---

## Resumo de Arquivos

| Ação | Arquivo |
|------|---------|
| Editar | `tailwind.config.ts`, `src/index.css` |
| Reescrever | `Navbar.tsx`, `Footer.tsx`, `Home.tsx`, `Sobre.tsx`, `Cultos.tsx`, `Contato.tsx` |
| Criar | `PrimeiraVisita.tsx`, `QuemEJesus.tsx`, `NoQueCremos.tsx`, `Lideranca.tsx`, `Ministerios.tsx` (estática), `ComoChegar.tsx` |
| Criar | `MobileFloatingCTA.tsx`, `SectionHeading.tsx`, `PageHero.tsx`, `InfoBar.tsx`, `ServiceCard.tsx`, `FeatureHighlight.tsx` |
| Editar | `App.tsx` (novas rotas), `Layout.tsx` (floating CTA) |

Todas as fotos reais existentes serão mantidas e reutilizadas. Nenhuma informação factual será inventada.

