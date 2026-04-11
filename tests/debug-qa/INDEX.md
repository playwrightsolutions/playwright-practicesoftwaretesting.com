# 🧪 QA Debug Tests - Investigação do Select Subject

## Descrição
Arquivos de debug criados durante investigação do problema com o campo Subject do formulário de contato.

**Problema identificado:** O campo Subject retorna erro "Subject is required" mesmo após selectOption() ser executado com sucesso.

## Arquivos

### inspect.spec.ts
Inspeciona a estrutura HTML da página de contato (labels, inputs, botões, etc)

### debug-submit.spec.ts
Testa o fluxo de submit e verifica qual mensagem de alerta aparece após submeter

### test-all-options.spec.ts
Tenta submeter o formulário com TODAS as 6 opções de Subject diferentes para encontrar qual funciona

### inspeciona-select.spec.ts
Inspeciona o HTML exato do elemento SELECT para verificar se é <select> real ou customizado

## Como executar

```bash
# Rodar um teste específico
npx playwright test tests/debug-qa/inspect.spec.ts --headed

# Rodar todos
npx playwright test tests/debug-qa --headed
```

## Descobertas

✅ Confirma que selectOption() funciona (value fica correto)
❌ Mas validação ainda rejeita (Subject is required)
❌ Nenhuma das 6 opções passou

## Próximas ações necessárias
- [ ] Verificar requests de network para ver POST sendo enviado
- [ ] Debugar console errors no navegador
- [ ] Avaliar se há validação customizada em JS
- [ ] Considerar reportar bug no site de prática
