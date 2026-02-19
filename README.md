# Accessibility Devkit

> A developer-first toolkit for building accessible web experiences the right way.

`accessibility-devkit` is not another overlay widget. It is a collection of code-level tools, configurations, and best-practice patterns designed to help developers build robust, accessible applications from the ground up. It makes the *correct* way of implementing accessibility the *easy* way.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## Philosophy

Web accessibility is not a feature that can be bolted on after the fact. True accessibility is an integral part of the development process, just like performance, security, and responsive design. This toolkit is built on three core principles:

1.  **Code-Level Integration:** Accessibility should be addressed at the source. I provide tools that integrate directly into your development workflow, from linting and testing to providing accessible component primitives.
2.  **Layered Approach:** No single tool can solve accessibility. I provide a layered toolkit that covers testing, component patterns, and specific disability accommodations, allowing you to choose the right tool for the job.
3.  **Developer Experience:** I believe that making accessibility easy for developers is the key to a more accessible web. My tools are designed to be ergonomic, well-documented, and easy to integrate into any project.

For a more detailed explanation of why this approach is superior to overlay widgets, please read our guide: [Why Not Overlays?](./docs/02-why-not-overlays.md).

## Packages

This repository is a monorepo containing the following packages:

| Package                               | Description                                                                 |
| ------------------------------------- | --------------------------------------------------------------------------- |
| **`@accessibility-devkit/audit`**     | Pre-configured accessibility testing with Axe and ESLint.                   |
| **`@accessibility-devkit/components`**| Unstyled, accessible component patterns and focus management utilities.     |
| **`@accessibility-devkit/accommodations`** | Utilities for specific accommodations like color blindness and reduced motion. |


## Getting Started

To get started, install the packages you need in your project:

```bash
pnpm install @accessibility-devkit/audit @accessibility-devkit/components
```

Then, refer to the individual package `README.md` files for detailed usage instructions.

## Related Projects

| Project | Description |
| --- | --- |
| [accessibility-devkit-llm](https://github.com/lukeslp/accessibility-devkit-llm) | LLM extension: prompts, skills, tools, MCP servers, and API wrappers for accessibility workflows. |
| [awesome-accessibility](https://github.com/lukeslp/awesome-accessibility) | Curated list of accessibility resources, tools, and best practices. |
| [accessibility-atlas](https://github.com/lukeslp/accessibility-atlas) | 53 datasets on disability demographics, web accessibility, and assistive technology usage. |

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
