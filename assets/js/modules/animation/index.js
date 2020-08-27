import { $ } from '../utils'
// import SVG from 'svg.js'

import { loadBoxSVG, boxAnimation } from './box.js'
import { loadArchSVG, archAnimation } from './arch.js'

export function mountSVG(selectID, svgMap) {
  var obj = $(selectID)
  var isDOM = (typeof HTMLElement === 'object') ?obj instanceof HTMLElement:obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
  Object.keys(svgMap).forEach(val => {
    const div = document.createElement('div')
    isDOM&&$(selectID).appendChild(div)
    div.innerHTML = svgMap[val].svg
    div.setAttribute("id", val)
    // div.style.position = 'absolute'
    // div.style.transform = svgMap[val].transform
  })
}

export default function () {
  if (!$("#js-home-animation")) {
    return
  }

  loadBoxSVG()
  boxAnimation()

  loadArchSVG()
  archAnimation()
}