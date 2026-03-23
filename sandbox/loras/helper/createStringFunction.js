function createStringFunction(functionString) {
    return `${functionString.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g,'').replace(/[\n\r]/g, '').replace(/\s{2,10}/g, ' ').replace(/'/g, '"') }; return decode(input, nomenclature);`;
  }

  module.exports = createStringFunction;