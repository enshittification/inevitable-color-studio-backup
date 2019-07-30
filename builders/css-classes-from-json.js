const flatten = require('lodash/flatten')
const toKebabCase = require('lodash/kebabCase')

const PALETTE = require('../dist/colors.meta.json')

const formatHex = require('../utilities/to-formatted-hex-value')

const colors = PALETTE.colors.map(colorArray => {
  const source = colorArray.filter(colorObject => !colorObject._meta.alias)
  const aliases = colorArray.filter(colorObject => colorObject._meta.alias)

  return source.map(colorObject => {
    return formatClassEntry(colorObject, aliases)
  })
})

printStylesheet(colors)

function formatClassEntry(colorObject, aliases) {
  const colorSelector = formatClassSelector(colorObject, aliases)
  const colorValue = formatHex(colorObject.value)

  return `${colorSelector} {
  color: ${colorValue};
}`
}

function formatClassSelector(colorObject, aliases) {
  const aliasObjects = []

  aliases.forEach(aliasObject => {
    const aliasObjectName = `${aliasObject._meta.baseName} ${aliasObject._meta.index}`

    if (colorObject.name === aliasObjectName) {
      aliasObjects.push(aliasObject)
    }
  })

  return aliasObjects.concat(colorObject).map(formatClassName).join(',\n')
}

function formatClassName(colorObject) {
  return `.color-${toKebabCase(colorObject.name.toLowerCase())}`
}

function printStylesheet(colorArrays) {
  const blocks = flatten(colorArrays)

  blocks.unshift(`/* Generated by Color Studio v${PALETTE.version} */`)
  console.log(blocks.join('\n\n'))
}
