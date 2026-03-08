

# Passe Final de Refinamento — ICB 610

## Resumo

Refinamento de acabamento em todo o site: ajustes na Home (logo, legibilidade, ritmo, Instagram, transição CTA/footer), elevação visual de todas as páginas internas ao nível da Home, mobile-first aprimorado, e consistência do sistema visual.

---

## 1. Navbar — Logo maior + legibilidade sobre hero

**Arquivo:** `src/components/layout/Navbar.tsx`

- Logo: `h-12 md:h-14` → `h-14 md:h-16` (mais presença)
- Quando não scrolled (sobre hero): adicionar text-shadow sutil nos links para legibilidade, e mudar `text-white/80` → `text-white/90`
- Header não-scrolled: adicionar um gradiente superior sutil para contraste (`bg-gradient-to-b from-black/30 to-transparent` quando não scrolled)
- Mobile hamburger: aumentar área de toque para `p-2.5`

## 2. Home — Ritmo vertical e refinamentos

**Arquivo:** `src/pages/Home.tsx`

- Reduzir `section-padding` entre seções que se encadeiam (welcome → versículo → cultos): usar `py-12 md:py-20` em vez de `section-padding` nas seções "Uma palavra" e "Primeira visita" para reduzir espaço excessivo
- **Instagram**: adicionar `shadow-md hover:shadow-lg` nos cards de foto, leve `ring-1 ring-warm-200` para profundidade, aspect-ratio variado (primeiro e último `aspect-[4/5]`, meio `aspect-square`) para quebrar uniformidade, adicionar ícone de Instagram como overlay sutil no hover
- **Transição CTA final → Footer**: adicionar `mb-0` no CTA final + no Footer adicionar um gradiente superior sutil (`pt-0` com `bg-gradient-to-b from-church-900 to-church-800` nos primeiros px) para suavizar transição

## 3. Footer — Transição suave

**Arquivo:** `src/components/layout/Footer.tsx`

- Trocar `bg-church-800` por `bg-church-900` com borda superior `border-t border-warm-700/30`
- Isso cria continuidade natural após o CTA final (que já tem overlay escuro)

## 4. PageHero — Overlay reforçado + melhor contraste

**Arquivo:** `src/components/ui/PageHero.tsx`

- Reforçar overlay com gradiente mais forte na base para texto: adicionar `bg-gradient-to-t from-black/60 via-black/30 to-transparent` como camada extra
- Aumentar `text-white/80` → `text-white/85` no subtítulo
- Hero height mobile: `min-h-[260px]` → `min-h-[300px]` para mais respiro

## 5. Sobre — Tabs premium + timeline refinada

**Arquivo:** `src/pages/Sobre.tsx`

- **Tabs**: aumentar `h-12` → `h-14`, adicionar `text-base` no trigger, estado ativo com borda inferior dourada (`data-[state=active]:border-b-2 data-[state=active]:border-church-gold`), remover shadow-sm do ativo em favor de borda
- **Timeline mobile**: garantir que a linha vertical e pontos estejam bem alinhados, aumentar padding dos cards timeline para `p-5 md:p-6`
- **Galeria**: adicionar `shadow-sm hover:shadow-lg` e `ring-1 ring-warm-100` nos items
- **CTA final**: trocar `bg-church-800` por seção com imagem overlay (consistente com Home)

## 6. Cultos — CTA mais forte

**Arquivo:** `src/pages/Cultos.tsx`

- Adicionar `bg-warm-50` wrapper na seção de cards para diferenciação visual
- CTA final: usar overlay com imagem em vez de `bg-warm-50` simples, para mais impacto emocional (padrão da Home)

## 7. Contato — Mais hierarquia

**Arquivo:** `src/pages/Contato.tsx`

- Aumentar `p-5` → `p-6` nos contact cards
- FAQ: usar Accordion do Radix em vez de cards estáticos para interatividade
- CTA final: trocar `bg-church-800` por overlay com imagem (consistência)

## 8. Primeira Visita — Mais acolhedor

**Arquivo:** `src/pages/PrimeiraVisita.tsx`

- Aumentar `p-5` → `p-6` nos FAQ cards
- Ícone: `w-9 h-9` → `w-10 h-10` para consistência com outros cards
- CTA: trocar `bg-warm-50` por overlay com imagem (consistência)

## 9. Quem é Jesus — Mais emocional

**Arquivo:** `src/pages/QuemEJesus.tsx`

- Adicionar separador visual entre seções (`border-b border-warm-100 pb-12 mb-12` em vez de só `mt-16`)
- CTA: overlay com imagem em vez de `bg-warm-50`

## 10. NoQueCremos, Liderança, Ministérios, ComoChegar — Padronização

**Arquivos:** Todas as 4 páginas

- Padronizar CTA final: todas usam overlay com imagem (`sobre_nos.png` ou `banner.png`) + texto branco + botões `btn-primary-warm` + `btn-outline-warm`
- Garantir `card-warm p-6` consistente em todos os cards
- Liderança: aumentar foto do pastor para `w-36 h-36 md:w-44 md:h-44`

## 11. MobileFloatingCTA — Mais elegante

**Arquivo:** `src/components/ui/MobileFloatingCTA.tsx`

- Adicionar animação de entrada (slide-up quando `visible` muda)
- Aumentar `py-3` → `py-3.5` para melhor área de toque
- Adicionar `shadow-xl` em vez de `shadow-lg`

## 12. ServiceCard — Mobile refinamento

**Arquivo:** `src/components/ui/ServiceCard.tsx`

- Aumentar padding mobile: `p-5 md:p-8` → `p-6 md:p-8`
- Featured card: `shadow-md` → `shadow-lg` para mais destaque

## 13. CSS Global — Consistência

**Arquivo:** `src/index.css`

- Ajustar `.section-padding` para `py-14 md:py-20` (ligeiramente mais compacto)
- Adicionar `.section-padding-lg` para `py-16 md:py-24` (usado no hero CTA)
- Adicionar `.cta-section-overlay` class reutilizável para os CTAs finais com imagem

---

## Resumo de Arquivos Alterados

| Arquivo | Tipo de Mudança |
|---------|----------------|
| `Navbar.tsx` | Logo maior, legibilidade, gradiente header |
| `Footer.tsx` | Cor mais escura, transição suave |
| `Home.tsx` | Ritmo vertical, Instagram refinado |
| `PageHero.tsx` | Overlay reforçado, altura mobile |
| `Sobre.tsx` | Tabs premium, galeria, CTA |
| `Cultos.tsx` | CTA mais forte |
| `Contato.tsx` | Cards maiores, CTA consistente |
| `PrimeiraVisita.tsx` | Cards maiores, CTA consistente |
| `QuemEJesus.tsx` | Separadores, CTA consistente |
| `NoQueCremos.tsx` | CTA consistente |
| `Lideranca.tsx` | Foto maior, CTA consistente |
| `MinisteriosPage.tsx` | CTA consistente |
| `ComoChegar.tsx` | CTA consistente |
| `MobileFloatingCTA.tsx` | Animação, toque maior |
| `ServiceCard.tsx` | Padding mobile |
| `index.css` | Padding ajustado, classe CTA overlay |

