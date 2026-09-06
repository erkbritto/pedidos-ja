# Commits sugeridos

Nenhum commit, push, tag ou alteração no histórico Git foi executado por mim.
Esta lista cobre somente as correções ainda pendentes no diff atual.

1. **`fix: endurece contratos HTTP e IDs de pedidos`**
  - Rejeita campos extras, valida IDs estritamente e garante 404 JSON para
    subrotas inválidas; inclui regressões de API e assets.
2. **`fix: corrige fluxos do frontend`**
  - Corrige troca de produto, botão de status do Admin, sucesso e catálogo.
3. **`fix: torna rollback de persistência explícito`**
  - Faz rollback quando `commit()` falha em operações de escrita.
4. **`docs: alinha documentação e execução`**
  - Atualiza rotas, códigos HTTP, banco de teste, Docker, Alembic e restart.

<!-- Histórico da organização inicial mantido apenas no histórico Git. -->
<!--
1. **`chore: reorganiza o repositório em monorepo (frontend/ + backend na raiz)`**
