---
name: e2e-testing
description: Guides the creation of Playwright E2E tests from planning through implementation. Covers test plan creation, data seeding/factories, page object development (single-file or folder-per-module), and test writing with human checkpoints at each stage. Follows Command Alkon project structure standards.
---

# Writing E2E Tests

Create Playwright end-to-end tests for a feature or workflow, from plan
through passing tests. Follow this workflow step by step. **Stop after
each step and check in with the user before proceeding.**

## Before you begin - structure preferences

Ask the user the following questions before starting. Use their answers
throughout all steps.

### Page object structure

> Which page object structure would you like to use?
>
> **(A) Single-file** - One class file per page (e.g.,
> `lib/page/cart/cart.ts`). Simpler, easier to maintain. Locators,
> actions, and flows live in the same class.
>
> **(B) Folder-per-module** - A folder per page with separate files
> (e.g., `lib/page/cart/index.ts`, `locators.ts`, `flows.ts`). Better
> separation when pages grow large.

### Assertion placement

> Where should page-specific assertions live?
>
> **(A) Inline in tests** - Assertions stay in the test spec files.
> Simpler, less abstraction.
>
> **(B) Separate assertions file** - Page-scoped assertions in
> `lib/page/<page-name>/assertions.ts`.
> Shared assertion helpers in `lib/verify/`.

Store these choices and apply them consistently for the rest of the
session.

---

## Workflow checklist

```
E2E Test Progress:
- [ ] Step 1: Create the test plan
- [ ] Step 2: Seed test data / set up factories (skip if not needed)
- [ ] Step 3: Create/update page objects
- [ ] Step 4: Write the tests
```

## Step 1: Create the test plan

Read and analyze the feature or workflow to be tested. Identify key
interaction points, required test data, page objects, and test scenarios.

If the user provides specific test scenarios, use ONLY those. Do not
invent additional scenarios.

Present the plan in chat using this structure:

    # Test Plan for [Feature]
    [Overview]

    ## Setup Required
    - [Entity]: [Quantity], [Attributes], [Relationships]
    - Static data files needed (JSON in `data/`)
    - Factory classes/functions needed (`lib/factories/`)

    ## Page Object Modifications & Creations
    - [Page Object]: [Changes or new methods needed]
    - Structure: [single-file or folder-per-module per user's choice]

    ## API Helpers Needed
    - [Endpoint wrapper]: [Purpose] (in `lib/api/`)

    ## Test Cases to Implement
    - **[Test Case]**: [Description]
      - Steps: [Numbered steps]
      - Expected Result: [Outcome]

Include exact data requirements - quantities, attributes, relationships.
Use timestamps in test identifiers to avoid conflicts. Do NOT write the
plan to a file. Document assumptions about existing system state.

**-> STOP. Present the plan. Confirm scope, test cases, and data
requirements with the user before proceeding.**

## Step 2: Seed test data / set up factories

_Skip if the test plan requires no new data. Tell the user immediately
and move to Step 3._

### Static test data

Place static test data (user emails, company refs, UI field values) in
the `data/` directory as JSON files. Use kebab-case naming:
`data/company.json`, `data/field-values.json`.

### Data factories

Use `lib/factories/` for factory classes or functions that build full
entities with sensible defaults and overrides:

    // lib/factories/order-factory.ts
    import { Order } from '../types';

    export function buildOrder(overrides: Partial<Order> = {}): Order {
      return {
        id: `order-${Date.now()}`,
        status: 'pending',
        ...overrides,
      };
    }

### API helpers

Use `lib/api/` for API client code, endpoint wrappers, and
test-state control via API calls. These are shared by both UI and API
tests.

    // lib/api/endpoints/orders.ts
    export async function createOrder(data: OrderPayload): Promise<Order> {
      // POST to orders endpoint
    }

1. Review existing factories and API helpers before creating new ones.
2. If the needed entity type isn't supported, extend the appropriate
   module.
3. Create a test spec file that seeds the data with meaningful,
   varied values and console logging for visibility.
4. Run the seed to verify data creation.

**-> STOP. Confirm data was created successfully or that this step was
skipped. Share a summary of what was seeded.**

## Step 3: Create/update page objects

1. Read existing page object files to identify what can be reused or
   extended. Review current locator strategies.
2. For each page/component in the plan, create or update page objects
   following the user's chosen structure (see below).
3. Use Playwright MCP to validate locators - navigate to the page,
   take browser snapshots, and verify elements exist. If locators need
   discovery, explore the feature: snapshot before and after key
   interactions, test locator reliability across multiple attempts.
4. Document assumptions about page state or prerequisites.

### Locator priority

1. `getByTestId('...')` - preferred
2. `getByRole('button', { name: /save/i })` / `getByLabel(...)` / `getByText(...)`
3. `page.locator('[data-testid="..."]')` - fallback
4. CSS selectors - last resort only

Never use auto-generated classes (e.g., `css-1x2y3z`), positional
selectors (`nth-child`), or exact text matches when a pattern/regex
works.

### Option A: Single-file structure

One class per page at `lib/page/<page-name>/<page-name>.ts`:

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

### Option B: Folder-per-module structure

A folder per page at `lib/page/<page-name>/` with:

- `index.ts` - page class with single atomic actions, exports the class
- `locators.ts` - all page-scoped locators
- `flows.ts` - multi-step sequences used only on this page

**locators.ts:**

    import { Page } from '@playwright/test';

    export function getCartLocators(page: Page) {
      return {
        checkoutButton: page.getByTestId('checkout-btn'),
        itemList: page.getByTestId('item-list'),
      };
    }

**index.ts:**

    import { Page } from '@playwright/test';
    import { getCartLocators } from './locators';

    export class CartPage {
      readonly page: Page;
      private locators: ReturnType<typeof getCartLocators>;

      constructor(page: Page) {
        this.page = page;
        this.locators = getCartLocators(page);
      }

      async clickCheckout(): Promise<void> {
        await this.locators.checkoutButton.click();
      }
    }

**flows.ts:**

    import { CartPage } from './index';

    export async function completeCheckoutSteps(cart: CartPage): Promise<void> {
      // orchestrate multi-step sequence
    }

### Assertions (if user chose separate file)

Page-scoped assertions go in `lib/page/<page-name>/assertions.ts`
(folder-per-module) or
`lib/page/<page-name>/<page-name>-assertions.ts` (single-file).

Shared assertion helpers go in `lib/verify/`.

    // lib/page/cart/assertions.ts
    import { expect } from '@playwright/test';
    import { CartPage } from './index';

    export async function expectCartItemCount(cart: CartPage, count: number): Promise<void> {
      await expect(cart.locators.itemList).toHaveCount(count);
    }

### Page object rules

- No business logic in page objects - purely UI interaction
- Name methods after user actions: `clickSaveButton()` not `click()`
- Panels: expose as separate objects (e.g., `addPanel`, `editPanel`,
  `dialog`) so tests can scope within them
- One module per page or feature
- Tests can import and use multiple pages - the folder structure
  groups tests, not page usage

**-> STOP. Present the page object classes. Review locator strategies
and method signatures with the user.**

## Step 4: Write the tests

1. Read the test plan to identify the specific test case to implement.
2. Read the relevant page objects to understand available methods.
3. Write the test. Do NOT reference application source code to generate
   locators - use only what the page objects provide.
4. Run the tests to confirm they pass.

### Test file conventions

- Location: `tests/ui/<feature>/` (e.g., `tests/ui/cart/`)
- Naming: kebab-case with `.spec.ts` suffix (e.g.,
  `cart-checkout.spec.ts`)
- Feature-scoped utils go in `tests/ui/<feature>/utils/`

### Using test.step

Use `test.step()` to break actions and assertions into named steps.
This produces clear traces and reports without needing BDD frameworks.
Be pragmatic - don't wrap every single line. Group logically related
actions.

Because `test.step` provides the narrative, you do NOT need comments
in spec files to explain what the test is doing.

    import { test, expect } from '@playwright/test';
    import { CartPage } from '../../lib/page/cart';

    test('user can complete checkout', async ({ page }) => {
      const cart = new CartPage(page);

      await test.step('Navigate to cart with items', async () => {
        await page.goto('/cart');
        await expect(cart.itemList).toBeVisible();
      });

      await test.step('Complete checkout flow', async () => {
        await cart.completeCheckoutSteps();
      });

      await test.step('Verify order confirmation', async () => {
        await expect(page.getByTestId('order-confirmation')).toBeVisible();
      });
    });

**-> STOP. Share test results. Confirm the test passes and covers the
intended scenario.**

## Naming conventions

All naming follows kebab-case (lowercase, hyphens) unless otherwise
noted:

| What                | Convention               | Example                                     |
| ------------------- | ------------------------ | ------------------------------------------- |
| Files and folders   | kebab-case               | `cart-checkout.spec.ts`, `order-factory.ts` |
| Page object folders | kebab-case               | `lib/page/cart/`, `lib/page/login/`         |
| Test folders        | kebab-case               | `tests/ui/cart/`, `tests/ui/orders/`        |
| Spec files          | kebab-case + `.spec.ts`  | `orders-cancel.spec.ts`                     |
| Repo names          | `qa-<domain>-playwright` | `qa-pricing-playwright`                     |
| Static data         | kebab-case JSON          | `data/field-values.json`                    |

Exceptions: dotfiles (`.env.example`), conventional config names
(`playwright.config.ts`, `package.json`).

## Project structure reference

```
project-root/
  config/
  data/
    <entity-or-company>/
    master-data/
  fixtures/
  lib/
    api/
    factories/
    page/
      <page-name>/          # kebab-case
        index.ts             # (folder-per-module) or <page-name>.ts (single-file)
        locators.ts          # (folder-per-module only)
        flows.ts             # (folder-per-module only)
        assertions.ts        # (if user chose separate assertions)
    utils/
    verify/                  # shared assertion helpers
  reporting/
    artifacts/
  scripts/
  setup/
  tests/
    ui/
      <feature>/
        <feature>.spec.ts
        utils/               # feature-scoped utils
```

## Critical rules

- Plan stays in chat, never written to a file
- If user provides test scenarios, use ONLY those - no extras
- Timestamps in test identifiers for isolation
- Validate locators via Playwright MCP, not by reading source code
- Run tests after seeding data AND after writing tests
- Set realistic scope - avoid feature creep
- All files and folders use kebab-case
- Locator priority: testId > role/label/text > CSS

## Anti-patterns

- Generating locators by reading application source code
- Using auto-generated CSS classes as selectors
- Using positional selectors (nth-child) or exact text matches
- Putting business logic in page objects
- Writing the test plan to a file instead of keeping it in chat
- Inventing test scenarios when the user provided specific ones
- Adding comments in spec files that duplicate test.step descriptions
- Using PascalCase or camelCase for file/folder names
- Creating a root-level `utils/` folder (shared utils go in `lib/utils/`)
