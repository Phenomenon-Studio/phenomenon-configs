# @phenomenon-studio/stylelint-config

`stylelint-config-standard` plus the team's rules. `/tailwind` also allows Tailwind v4 at-rules and `theme()`.

```js
// stylelint.config.js
export default {
    extends: ['@phenomenon-studio/stylelint-config/tailwind'], // or '@phenomenon-studio/stylelint-config'
};
```

Ignore build output with a `.stylelintignore` in the project. Stylelint resolves `ignoreFiles` relative to the config that declares them, so this package cannot ship them.
