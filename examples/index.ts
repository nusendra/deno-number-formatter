import Formatter from "./../mod.ts"

const numberFormat = new Formatter().format("#,##0.00", 123456789.123);
console.log(numberFormat)