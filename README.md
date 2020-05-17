# deno-number-formatter
Number formatter in deno

# how to use
```
import Formatter from "https://deno.land/x/number_formatter/mod.ts"

const numberFormat = new Formatter().format("#,##0.00", 123456789.123);
console.log(numberFormat)
```
