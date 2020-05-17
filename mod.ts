import { MaskObject, ValueObject } from "./types.ts"

class Formatter {
  private maskRegex: RegExp = /[0-9\-+#]/;
  private notMaskRegex: RegExp = /[^\d\-+#]/g;
  private maskObject: MaskObject;

  constructor() {
    this.maskObject = {
      prefix: "",
      suffix: "",
      mask: "",
      isNegative: false,
      isPositive: true,
      decimal: "",
      separator: "",
      integer: "",
      fraction: "",
    };
  }

  private getIndex(mask: string) {
    return mask.search(this.maskRegex);
  }

  private reverseString(mask: string, maskLength: number) {
    const end: number = mask.search(mask.split("").reverse().join(""));
    const offset: number = maskLength - end;
    const substr: string = mask.substring(offset, offset + 1);

    const index: number = offset +
      ((substr === "." || (substr === ",")) ? 1 : 0);
    this.maskObject.suffix = end > 0 ? mask.substring(index, maskLength) : "";
    this.maskObject.mask = mask.substring(this.getIndex(mask), index);
    this.maskObject.isNegative = this.maskObject.mask.charAt(0) === "-";
    this.maskObject.isPositive = this.maskObject.mask.charAt(0) === "+";
  }

  private masking(mask: string) {
    const maskLength: number = mask.length;
    const startMasking: number = this.getIndex(mask);
    this.maskObject.prefix = startMasking > 0 ? mask.substring(0, startMasking) : "";

    this.reverseString(mask, maskLength);

    let result: RegExpMatchArray | null = this.maskObject.mask.match(
      this.notMaskRegex,
    );
    this.maskObject.decimal = (result && result[result.length - 1]) || ".";
    this.maskObject.separator = (result && result[1] && result[0]) || ",";

    result = this.maskObject.mask.split(this.maskObject.decimal);
    this.maskObject.integer = result[0];
    this.maskObject.fraction = result[1];
    return this.maskObject;
  }

  private valueFormatting(value: number, maskObject: MaskObject) {
    let isNegative: boolean = false;
    const vo: ValueObject = {
      value,
      sign: "",
      integer: "",
      fraction: "",
      result: "",
    };

    if (value < 0) {
      isNegative = true;
      vo.value = -vo.value;
    }

    vo.sign = isNegative ? "-" : "";

    vo.value = Number(vo.value).toFixed(
      maskObject.fraction.toString && maskObject.fraction.length,
    );
    vo.value = Number(vo.value).toString();

    const posTrailZero: any = maskObject.fraction &&
      maskObject.fraction.lastIndexOf("0");
    let [valInteger = "0", valFraction = ""] = vo.value.split(".");
    if (!valFraction || (valFraction && valFraction.length <= posTrailZero)) {
      valFraction = posTrailZero < 0
        ? ""
        : (Number("0." + valFraction).toFixed(posTrailZero + 1)).replace(
          "0.",
          "",
        );
    }

    vo.integer = valInteger;
    vo.fraction = valFraction;
    this.separators(vo, maskObject);

    if (vo.result === "0" || vo.result === "") {
      isNegative = false;
      vo.sign = "";
    }

    if (!isNegative && maskObject.isPositive) {
      vo.sign = "+";
    } else if (isNegative && maskObject.isPositive) {
      vo.sign = "-";
    }

    return vo;
  }

  private separators(vo: ValueObject, maskObject: MaskObject) {
    vo.result = "";
    const szSep: string[] = maskObject.integer.split(maskObject.separator);
    const maskInteger: string = szSep.join("");

    const posLeadZero: any = maskInteger && maskInteger.indexOf("0");
    if (posLeadZero > -1) {
      while (vo.integer.length < (maskInteger.length - posLeadZero)) {
        vo.integer = "0" + vo.integer;
      }
    } else if (Number(vo.integer) === 0) {
      vo.integer = "";
    }

    const posSeparator: any = (szSep[1] && szSep[szSep.length - 1].length);
    if (posSeparator) {
      const voLength: number = vo.integer.length;
      const offset: number = voLength % posSeparator;
      for (let index = 0; index < voLength; index++) {
        vo.result += vo.integer.charAt(index);
        if (
          !((index - offset + 1) % posSeparator) &&
          index < voLength - posSeparator
        ) {
          vo.result += maskObject.separator;
        }
      }
    } else {
      vo.result = vo.integer;
    }

    vo.result += (maskObject.fraction && vo.fraction)
      ? maskObject.decimal + vo.fraction
      : "";
    return vo;
  }

  public format = (mask: string, value: number) => {
    if (!mask || isNaN(Number(value))) {
      return value;
    }

    const maskObject: MaskObject = this.masking(mask);
    const vo: ValueObject = this.valueFormatting(value, maskObject);

    return maskObject.prefix + vo.sign + vo.result + maskObject.suffix;
  };
}

export default Formatter;
