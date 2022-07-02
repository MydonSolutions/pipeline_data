export {
  round_decimals,
  byte_string,
  ratio_string
}

function round_decimals(num:number, decimals:number):number {
  return Math.round(num * 10**decimals)/10**decimals
}

function byte_string(bytes:number):string {
  if (bytes < 1e3) {
    return `${bytes} Bytes`;
  } else if (bytes < 1e6) {
    return `${(round_decimals(bytes, 3)/1e3).toFixed(3)} KB`;
  } else if (bytes < 1e9) {
    return `${(round_decimals(bytes, 3)/1e6).toFixed(3)} MB`;
  } else if (bytes < 1e12) {
    return `${(round_decimals(bytes, 3)/1e9).toFixed(3)} GB`;
  } else if (bytes < 1e16) {
    return `${(round_decimals(bytes, 3)/1e12).toFixed(3)} TB`;
  }
}

function ratio_string(ratio:number):string {
  if(ratio < 1) {
    return `${round_decimals(1/ratio, 4)}:1`;
  }
  else {
    return `1:${round_decimals(ratio, 4)}`;
  }
}