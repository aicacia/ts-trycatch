# ts-trycatch

[![license](https://img.shields.io/badge/license-MIT%2FApache--2.0-blue")](LICENSE-MIT)
[![docs](https://img.shields.io/badge/docs-typescript-blue.svg)](https://aicacia.github.io/ts-trycatch/)
[![npm (scoped)](https://img.shields.io/npm/v/@aicacia/trycatch)](https://www.npmjs.com/package/@aicacia/trycatch)
[![build](https://github.com/aicacia/ts-trycatch/workflows/Test/badge.svg)](https://github.com/aicacia/ts-trycatch/actions?query=workflow%3ATest)

typesafe go like tuple results for async and sync code

## Examples

### Sync

```typescript
import { trycatch } from "@aicacia/trycatch";

const [numbers, err] = trycatch(() => {
  const numbers = [];
  for (let i = 0; i < 10; i++) {
    numbers.push(maybeWillThrow(i));
  }
  return numbers;
});
if (err) {
  // handle err
}
// use numbers
```

### Async

```typescript
import { trycatch } from "@aicacia/trycatch";

const [numbers, err] = await trycatch(async () => {
  const numbers = [];
  for (let i = 0; i < 10; i++) {
    numbers.push(await maybeWillThrowAsync(i));
  }
  return numbers;
});
if (err) {
  // handle err
}
// use numbers
```
