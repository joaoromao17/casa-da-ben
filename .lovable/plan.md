
## Alteração: Dias de Culto

Todos os arquivos onde o horário precisa ser atualizado para o novo esquema:
- **Terça-feira** → Culto de Oração — 20h ✅ (já estava correto)
- **Quinta-feira** → Culto da Palavra — 20h (novo, substituindo Quarta/Escola Bíblica)
- **Domingo** → Culto da Família — 20h (horário muda de 18h30 → 20h, e Sexta/Libertação é removida)

### Arquivos e mudanças:

1. **`src/pages/Cultos.tsx`** (linhas 29-32):
   - Domingo: `time="18h30"` → `time="20h"`, título mantido "Culto da Família"
   - Terça: mantém "Culto de Oração" (já está como "Reunião de Oração", atualizar nome)
   - Quarta "Escola Bíblica" → Quinta "Culto da Palavra"
   - Remover Sexta "Culto de Libertação"
   - Grid: `sm:grid-cols-2` com 3 cards (ajustar para `sm:grid-cols-3` ou manter 2 e o 3º centralizado)

2. **`src/pages/Home.tsx`** (linhas 145-148): mesmas mudanças nos ServiceCards

3. **`src/components/ui/InfoBar.tsx`** (linha 16): `"Domingo às 18h30"` → `"Domingo às 20h"`

4. **`src/components/layout/Footer.tsx`** (linhas 82-85):
   - Domingo — 20h, Terça — 20h, Quinta — 20h (remover Quarta e Sexta)

5. **`src/pages/Sobre.tsx`** (linhas 142-145): atualizar horários na aba Localização

6. **`src/pages/Contato.tsx`** (linhas 16, 20): atualizar string de horários e FAQ

7. **`src/pages/PrimeiraVisita.tsx`** (linhas 9, 74): `18h30` → `20h`

8. **`src/pages/ComoChegar.tsx`** (linha 82): `18h30` → `20h`

Como agora são apenas 3 cultos, o grid na Home e Cultos pode usar `sm:grid-cols-3` para ficarem lado a lado no mobile maior/desktop, ou manter `sm:grid-cols-2` com o 3º card centralizado. Vou usar `sm:grid-cols-2 lg:grid-cols-3` para melhor aproveitamento.
