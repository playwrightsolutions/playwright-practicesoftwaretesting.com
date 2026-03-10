# E2E Testing Reference

## Project Structure

```
project-root/
  .cursor/
    PROMPTS.md
    rules/
      local/                 # team/project-specific rules
    skills/
      local/                 # team/project-specific skills
  .github/
    CODEOWNERS
    workflows/
  config/                    # runner, env, Allure config (optional)
  data/
    <entity-or-company>/     # static test data as JSON
    master-data/             # JSON written by lib/api/get-master-data.ts
  fixtures/                  # Playwright fixtures, DI (optional)
  lib/
    api/                     # API client, endpoints/, get-master-data
    factories/               # data factory classes/functions
    page/
      <page-name>/           # kebab-case folder per page
        index.ts             # page class (folder-per-module)
        locators.ts          # page-scoped locators (folder-per-module)
        flows.ts             # multi-step sequences (folder-per-module)
        assertions.ts        # page-scoped assertions (optional)
    utils/                   # shared non-assertion helpers (login, selectList)
    verify/                  # shared assertion helpers
  reporting/
    artifacts/               # results, screenshots (add to .gitignore)
  scripts/                   # one-off automation (optional)
  setup/                     # auth, seed, env (optional)
  tests/
    ui/
      <feature>/             # kebab-case feature folders
        <feature>.spec.ts
        utils/               # feature-scoped test utils
  .eslintignore
  .gitignore
  .prettierignore
  .prettierrc
  package.json
  playwright.config.ts
  README.md
```

## Naming Conventions

**Everything is kebab-case** (lowercase, hyphens) unless it's a
dotfile or conventional config name.

| What | Convention | Example |
|---|---|---|
| Files | kebab-case | `cart-checkout.spec.ts` |
| Folders | kebab-case | `lib/page/cart/`, `tests/ui/orders/` |
| Page folders | kebab-case | `lib/page/login/`, `lib/page/shopping-cart/` |
| Spec files | `<feature>.spec.ts` | `orders-cancel.spec.ts` |
| Factory files | `<entity>-factory.ts` | `order-factory.ts` |
| Static data | JSON, kebab-case | `data/field-values.json` |
| Repo names | `qa-<domain>-playwright` | `qa-pricing-playwright` |

Exceptions: `.env.example`, `playwright.config.ts`, `package.json`,
`CODEOWNERS`, `README.md`.

## Selector / Locator Priority

1. **data-testid**: `page.getByTestId('submit-btn')` - preferred
2. **Role/label/text**: `page.getByRole('button', { name: /save/i })`, `page.getByLabel('Email')`
3. **data-testid via locator**: `page.locator('[data-testid="submit-btn"]')` - fallback
4. **CSS selectors**: Last resort only

### Locator rules

- Prefer `data-testid` first, then fall back to role/label/text
- Panels: expose as separate objects (`addPanel`, `editPanel`, `dialog`)
  so tests can scope within them
- Short prefixes are optional (btn, txt, list, pnl); document in
  `locators.md` next to the page or in the page folder
- One module per page or feature
- Export pattern: `getXxxLocators(page | frame)`
- Never use auto-generated CSS classes (e.g., `css-1x2y3z`)
- Never use positional selectors (`nth-child`)
- Avoid exact text matches when a regex/pattern works

## Page Object Patterns

### Single-file structure

One class per page: `lib/page/<page-name>/<page-name>.ts`

```typescript
import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  
  // -- Locators --
  readonly checkoutButton: Locator;
  readonly itemList: Locator;
  readonly addToCartButton: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.itemList = page.getByTestId('item-list');
    this.addToCartButton = page.getByTestId('add-to-cart-btn');
    this.checkoutButton = page.getByTestId('checkout-btn');
  }
  
  // -- Dynamic Locator (single, atomic) --
  getItemById(itemId: string): Locator {
    return this.page.getByTestId(`item-${itemId}`);
  }
  
  // -- Flows (multi-step sequences used only on this page) --
  async addToCartAndCheckout(itemId: string): Promise<void> {
    await this.getItemById(itemId).click();
    await this.addToCartButton.click();
    await this.checkoutButton.click();
  }
}
```

### Folder-per-module structure

A folder per page: `lib/page/<page-name>/` with `index.ts`,
`locators.ts`, `flows.ts`.

```typescript
// locators.ts
import { Page } from '@playwright/test';

export function getCartLocators(page: Page) {
  return {
    checkoutButton: page.getByTestId('checkout-btn'),
    itemList: page.getByTestId('item-list'),
  };
}
```

```typescript
// index.ts
import { Page } from '@playwright/test';
import { getCartLocators } from './locators';

export class CartPage {
  readonly page: Page;
  readonly locators: ReturnType<typeof getCartLocators>;

  constructor(page: Page) {
    this.page = page;
    this.locators = getCartLocators(page);
  }

  async clickCheckout(): Promise<void> {
    await this.locators.checkoutButton.click();
  }
}
```

```typescript
// flows.ts
import { CartPage } from './index';

export async function completeCheckoutSteps(cart: CartPage): Promise<void> {
  // orchestrate multi-step sequence
}
```

### Page object rules

- No business logic - purely UI interaction
- Name methods after user actions: `clickSaveButton()` not `click()`
- Panels as separate objects for scoping
- Tests can import multiple pages freely

## Data Factories

Use `lib/factories/` for factory functions that build full entities
with defaults and overrides:

```typescript
// lib/factories/order-factory.ts
export function buildOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: `order-${Date.now()}`,
    status: 'pending',
    ...overrides,
  };
}
```

## API Helpers

Use `lib/api/` for API client code and endpoint wrappers. Shared by
both UI and API tests.

```typescript
// lib/api/endpoints/orders.ts
export async function createOrder(data: OrderPayload): Promise<Order> {
  // POST to orders endpoint
}
```

## Static Test Data

Place static data in `data/` as JSON:

```
data/
  company.json
  usernames.json
  field-values.json
```

## Test Template

```typescript
import { test, expect } from '@playwright/test';
import { CartPage } from '../../lib/page/cart';

test('user can complete checkout', async ({ page }) => {
  const cart = new CartPage(page);

  await test.step('Navigate to cart with items', async () => {
    await page.goto('/cart');
    await expect(cart.checkoutButton).toBeVisible();
  });

  await test.step('Complete checkout flow', async () => {
    await cart.completeCheckoutSteps();
  });

  await test.step('Verify order confirmation', async () => {
    await expect(page.getByTestId('order-confirmation')).toBeVisible();
  });
});
```

### test.step guidelines

- Use `test.step()` to group logically related actions
- Be pragmatic - don't wrap every single line
- Steps replace comments: no need for `// Navigate to cart` when
  the step name says it
- Produces clear Playwright traces and reports

## Existing Helpers & Easy Paths

- [Authentication strategy, e.g., global setup saves session to `e2e/.auth/user.json` - tests reuse it automatically]
- [Override pattern for unauthenticated flows, e.g., `test.use({ storageState: { cookies: [], origins: [] } })`]
- [How to run tests, e.g., `npx playwright test --project=chromium`]

## Linting and Formatting

- **ESLint + Prettier** at project root
- Run via npm scripts: `npm run lint`, `npm run lint:fix`
- Prettier: `npm run format` / `npm run format:check`
- CI should fail the build on violations

## Functions & Patterns to Avoid

- Never use `page.evaluate(() => form.submit())` - bypasses SPA navigation
- Avoid `sleep` or hardcoded waits - use Playwright's built-in waiting
- Don't rely on `networkidle` alone - wait for specific elements or URL changes
- Never use auto-generated CSS classes
- Don't use positional selectors (`nth-child`)
- Don't add comments that duplicate `test.step` descriptions
- Don't create a root-level `utils/` folder (use `lib/utils/`)
- Don't use file suffixes like `-fun.ts`, `-helper.ts` - use `-page.ts` for
  page classes and `-util.ts` for shared helpers if suffixes are desired

## Utils Placement

| Situation | Where to put it |
|---|---|
| Shared across many tests | `lib/utils/` |
| One feature / few tests | `tests/ui/<feature>/utils/` |
| Truly one-off logic | Keep it in the test file |
| Used by only 2 tests | Feature utils file with `// used by:` comment |

## Framework-Specific Gotchas

[Document timing, navigation, or rendering quirks specific to the stack.]
- [e.g., Turbo/AJAX: `networkidle` does not mean DOM is queryable - always wait for specific elements]
- [e.g., Always `.trim()` text from `textContent()` - Playwright includes HTML whitespace]
- [e.g., Wait for container elements to be visible BEFORE iterating rows/counts]
