

# Plano: Converter o site para Landing Page informativa (sem backend)

## Contexto
O backend será desativado. O site precisa funcionar como uma landing page puramente informativa, sem autenticação nem chamadas à API. As páginas e arquivos existentes serão preservados para possível reativação futura.

## Classificação das páginas

### Páginas que PERMANECEM (estáticas/informativas)
- `/` (Home) - precisa remover chamadas API (versículo, avisos, ministérios, eventos)
- `/sobre` - já é estática
- `/contato` - já é estática (formulário pode ser mantido como visual)
- `/cultos` - já é estática
- `/politica-de-privacidade` - estática
- `/termos-de-uso` - estática
- `/apoiar-desenvolvedor` - estática
- `/instalar` - estática

### Páginas que terão navegação REMOVIDA (continuam existindo no código)
- `/login`, `/cadastro`, `/redefinir-senha`, `/reset-password` - autenticação
- `/minha-conta` - perfil do usuário
- `/membros` - lista de membros (depende do backend)
- `/estudos`, `/estudos/gerenciar` - estudos bíblicos (depende do backend)
- `/eventos`, `/eventos/:id` - eventos (depende do backend)
- `/contribuicoes`, `/contribuicoes/gerenciar`, `/contribuicoes/:id` - contribuições
- `/testemunhos` - testemunhos (depende do backend)
- `/oracao` - orações (depende do backend)
- `/ministerios`, `/ministerios/:id` - ministérios (depende do backend)
- `/admin` - painel administrativo
- `/profile-public/:id` - perfil público
- `/por-que-se-registrar` - incentivo ao cadastro
- `/relatar-bug` - depende de contexto de login

## Alterações planejadas

### 1. Navbar.tsx - Simplificar navegação
- Remover toda lógica de autenticação (token, roles, login/logout)
- Remover imports de `api`, `useAuth`, `AvisoModal`
- Manter apenas links: Início, Sobre, Cultos, Contato
- Remover botões Entrar/Cadastre-se/Sair/Minha Conta/Aviso
- Remover barra escura inferior com "Por que se cadastrar?" e "Instalar App"
- Manter Instagram na barra escura

### 2. Footer.tsx - Simplificar links
- Remover links para páginas que dependem do backend (Eventos, Ministérios, Escola Bíblica, Testemunhos, Instalar App)
- Manter: Sobre Nós, Cultos, Contato, Política de Privacidade, Termos de Uso
- Manter informações estáticas (horários, endereço, redes sociais)

### 3. Home.tsx - Remover chamadas API, manter conteúdo estático
- Remover fetch de versículo do dia (colocar um versículo fixo ou remover seção)
- Remover fetch de avisos gerais (remover seção de avisos)
- Remover fetch de ministérios (usar dados estáticos ou remover seção)
- Remover fetch de eventos (manter seção de cultos com dados estáticos, remover eventos dinâmicos)
- Remover toda lógica de autenticação/roles
- Remover imports de `api`, `useAuth`
- Ajustar links: botões "Cadastre-se/Minha Conta" vira algo informativo ou é removido
- Quick Access mobile: remover "Cadastre-se" e "Escola Bíblica", manter "Eventos" como link para Cultos

### 4. App.tsx - Remover rotas backend-dependentes
- Remover rotas: `/login`, `/cadastro`, `/redefinir-senha`, `/reset-password`, `/minha-conta`, `/membros`, `/estudos`, `/estudos/gerenciar`, `/eventos`, `/eventos/:id`, `/contribuicoes`, `/contribuicoes/gerenciar`, `/contribuicoes/:id`, `/testemunhos`, `/oracao`, `/ministerios`, `/ministerios/:id`, `/admin`, `/profile-public/:id`, `/por-que-se-registrar`, `/relatar-bug`, `/instalar`
- Manter: `/`, `/sobre`, `/cultos`, `/contato`, `/politica-de-privacidade`, `/termos-de-uso`, `/apoiar-desenvolvedor`, `*`
- Remover `AuthProvider` wrapper (não há mais autenticação)
- Remover imports das páginas removidas

### 5. AuthContext.tsx / useCurrentUser.ts / useAuth.ts - Não alterar
- Ficam preservados no código para reativação futura, apenas não serão usados

### 6. Contato.tsx - Verificar
- O formulário de contato pode ser mantido como visual, sem envio real (já parece ser local)

## Resultado final
O site terá apenas 6 rotas ativas:
- `/` - Home (informativa, sem API)
- `/sobre` - Sobre a igreja
- `/cultos` - Horários de culto
- `/contato` - Informações de contato
- `/politica-de-privacidade`
- `/termos-de-uso`
- `/apoiar-desenvolvedor`

