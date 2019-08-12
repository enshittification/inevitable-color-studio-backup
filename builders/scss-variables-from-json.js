const toKebabCase = require('lodash/kebabCase')
const formatHex = require('../utilities/to-formatted-hex-value')

const PALETTE = require('../dist/colors.meta.json')

const colors = PALETTE.colors.map(colorArray => {
  return orderByVariableEntry(colorArray).map(formatVariableEntry)
})

printStylesheet(colors)

function orderByVariableEntry(colorArray) {
  const source = colorArray.filter(colorObject => !colorObject._meta.alias)
  const aliases = colorArray.filter(colorObject => colorObject._meta.alias)

  return source.concat(aliases)
}

function formatVariableEntry(colorObject) {
  return `${formatVariableName(colorObject)}: ${formatVariableValue(colorObject)};`
}

function formatVariableName(colorObject) {
  return `$studio-${toKebabCase(colorObject.name.toLowerCase())}`
}

function formatVariableValue(colorObject) {
  if (!colorObject._meta.alias) {
    return formatHex(colorObject.value)
  }

  const name = `${colorObject._meta.baseName} ${colorObject._meta.index}`
  return formatVariableName({ name })
}

function printStylesheet(colorArrays) {
  const blocks = colorArrays.map(colorArray => {
    return colorArray.join('\n')
  })

  blocks.unshift([`// Generated by Color Studio v${PALETTE.version}`])
  console.log(blocks.join('\n\n'))
}
