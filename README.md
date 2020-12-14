# BetterLang VSCode Extension

This extension highlights exclusionary language in Markdown (.md) files and suggests alternative wording.

## The Idea

Documentation may be read by a wide variety of people and often persists after the writer has left the project or organization. When writer(s) are alerted to exclusive or toxic language at time of writing, they will be able to craft docs that support a larger community for a longer time.

## Actions

When BetterLang finds problematic language in an open file, it will prompt you to _substitute_ that phrase for a better one or to _delete_ it completely.

## Current Limitations

- English only
- Markdown only
- Operates on strings, not on grammatial units. (e.g., "whitelist" -> "allowlist" will not change the article from "a" to "an").

## Future Features

- Custom lexicons and/or on-the-fly lexicon customization
- Other (natural) languages
- Other (programming) languages
- Work on grammar level, not string level
- Maybe pull lexicon from [Self-Defined](https://www.selfdefined.app/)?

## Inspired by

- [Eleventy Inclusive Language](https://github.com/11ty/eleventy-plugin-inclusive-language/tree/8d9a0920523b7887ebdd3cca06fc328140772a1b)
