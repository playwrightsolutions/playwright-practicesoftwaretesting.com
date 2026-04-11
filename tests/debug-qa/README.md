# 🧪 Debug & QA Tests

Essa pasta contém todos os testes de debug e inspeção criados durante o processo de correção dos testes de contato.

## Arquivos

- **inspect.spec.ts** - Inspeciona a estrutura da página de contato (labels, inputs, botões)
- **debug-contact.spec.ts** - Debug específico de inputs da página de contato
- **debug-submit.spec.ts** - Testa o fluxo de submit e verifica mensagens de alerta
- **simple-select-debug.spec.ts** - Debug do elemento SELECT de Subject
- **novo-contact-test.spec.ts** - Teste completo com logs detalhados
- **test-all-subject-options.spec.ts** - Testa TODAS as opções de Subject para encontrar a correta
- **debug-select-options.spec.ts** - Análise detalhada das opções do select

## Como usar

```bash
# Rodar um arquivo específico
npx playwright test tests/debug-qa/inspect.spec.ts --headed

# Rodar todos os debug tests
npx playwright test tests/debug-qa --headed
```

## Notas de Investigação

✅ **Descobertas:**
- Link de Contact: `<A> "Contact" href="/contact"`
- Select Subject ID: `#subject`
- Valores de Subject: customer-service, webmaster, return, payments, warranty, status-of-order
- Testes principais estão em `tests/contact/` com seletores corretos

❌ **Pendências:**
- Validação de Subject ainda retorna "Subject is required" mesmo após selectOption
- Possível problema com evento de change ou validação do lado do servidor
