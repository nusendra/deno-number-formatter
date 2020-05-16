export type MaskObject = {
    prefix: string;
    suffix: string;
    mask: string;
    isNegative: boolean;
    isPositive: boolean;
    decimal: string;
    separator: string;
    integer: string;
    fraction: string;
  };
  
  export type ValueObject = {
    value: number | string;
    sign: string;
    integer: string;
    fraction: string;
    result: number | string;
  };