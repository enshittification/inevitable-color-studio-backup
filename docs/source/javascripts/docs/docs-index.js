const copyToClipboard = require('copy-text-to-clipboard')
const toArray = require('lodash/toArray')

const initDesaturationListener = require('./docs/desaturation')
const renderTile = require('./docs/tile')
const PALETTES = require('./docs/palettes')

const ELEMENT_DOWNLOAD_LINK = document.querySelector('#studio-download-link')
const ELEMENT_VERSION_SELECT = document.querySelector('#studio-version-select')
const ELEMENT_OUTPUT = document.querySelector('#studio-color-tiles')

createPaletteSelector(PALETTES)
initDesaturationListener(ELEMENT_OUTPUT)

function createPaletteSelector(palettes) {
  const options = palettes.map((palette, index) => {
    return `<option value="${index}">${palette.displayName}</option>`
  })

  ELEMENT_VERSION_SELECT.innerHTML = options.join()
  ELEMENT_VERSION_SELECT.removeAttribute('disabled')
  ELEMENT_VERSION_SELECT.addEventListener('change', event => {
    const index = parseInt(event.target.value, 10)
    selectPalette(index)
  })

  selectPalette(0)
}

function selectPalette(index) {
  const palette = PALETTES[index]

  setDownloadLink(palette)
  renderTiles(palette)
}

function setDownloadLink(palette) {
  ELEMENT_DOWNLOAD_LINK.setAttribute('href', palette.downloadLink)
  ELEMENT_DOWNLOAD_LINK.classList.remove('disabled')
}

function renderTiles(palette) {
  const colors = palette.colors.map(colorArray => {
    const html = colorArray.map(renderTile).join('')
    return html ? `<div class="d-flex pb-1">${html}</div>` : ''
  })

  ELEMENT_OUTPUT.innerHTML = colors.join('')
  activateTiles(ELEMENT_OUTPUT)
}

function activateTiles(scope = document) {
  toArray(scope.querySelectorAll('.tile')).forEach(element => {
    const color = String(element.dataset.color).trim()
    element.addEventListener('click', () => copyToClipboard(color))
  })
}