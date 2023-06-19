# Playwright Typescript Demo

I plan to create a playwright-demo repository showing off different features of playwright.

For many of the tests I will be using - <https://practicesoftwaretesting.com>

The the first of many articles utilizing this repo can be found <https://playwrightsolutions.com/how-do-you-define-an-apiurl-along-with-the-baseurl-in-playwright/>

## Getting Started

The framework we are using is [Playwright](https://playwright.dev/). If you want a good video to introduce you to Playwright, check out [this video](https://www.youtube.com/watch?v=_Jla6DyuEu4). You can try out playwright in the cloud [here](https://try.playwright.tech/).

For helpful tips checkout <https://playwrightsolutions.com>

## Installation

If you want to run this on your local machine, git clone the repo to local. In the main directory run the below commands. This will install playwright dependencies on your machine.

```bash
npm install
npx playwright install
```

## Running the automated checks

```bash
npx playwright test
```

## Running the Code Generator

```bash
npx playwright codegen
```

### Running the Tests in VS Code

The Playwright team has released a VS Code Extension that allows you to debug tests easily with the click or right click of a button.

- [Playwright Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
- [Video walk through of the features](https://www.youtube.com/watch?v=z0EOFvlf14U)

## Writing Assertions

\*[Playwright API Assertions](https://jestjs.io/docs/expect) - docs to the API assertions using Jest

## Playwright Resources

- [Playwright Docs](https://playwright.dev/docs/intro)
- [Playwright Solutions](https://playwrightsolutions.com/)
- [Awesome-Playwright](https://github.com/mxschmitt/awesome-playwright)
- [25 reasons to choose Playwright as your next web testing framework](https://www.marcusfelling.com/blog/2022/25-reasons-to-choose-playwright-as-your-next-web-testing-framework)
- [Create resilient 🎭 Playwright e2e tests with locators](https://www.marcusfelling.com/blog/2022/create-more-reliable-playwright-tests-with-locators/)
