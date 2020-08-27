import menuFunc from './modules/menu'
import tocFunc from './modules/toc'
import asideFunc from './modules/aside'
import searchFunc from './modules/search'
import paginationFunc from './modules/pagination'
import animationFunc from './modules/animation'

import zoom from 'zoom-image'
import 'zoom-image/css/zoom-image.css'

import { $$ } from './modules/utils'

const main = () => {

  // search page
  searchFunc()

  // Menu
  menuFunc()

  // TOC
  tocFunc()

  // aside get_code
  asideFunc()

  // pagination page
  paginationFunc()

  // image zoom
  $$('.typo img').forEach(imgElem => {
    zoom(imgElem)
  })

  // Animition
  animationFunc()
}

document.addEventListener('DOMContentLoaded', main)