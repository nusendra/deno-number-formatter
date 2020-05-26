<!-- markdownlint-disable MD033 MD041 -->

<div align='center'>

![deno-number-formatter](./header.png)

![release](https://badgen.net/github/release/nusendra/deno-number-formatter/)

</div>

## Usage

```ts
import Formatter from "https://deno.land/x/number_formatter/mod.ts";

const numberFormat = new Formatter().format("#,##0.00", 123456789.123);
console.log(numberFormat);
```

## License

MIT License Copyright (c) 2020 [Nusendra Hanggarawan](./LICENSE)
