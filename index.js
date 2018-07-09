/***************************************************************/

//console.log("Hello, World!")

const greet = (who = "World") => {
    setTimeout(() => console.clear(), 1000)
    console.log(`Hello, ${who}!`)
}

greet()

/***************************************************************/

import Vue from 'vue/dist/vue.js'

import ChessBoard from './chessboard.vue'

import { version } from './package.json'

window.vm = new Vue(
  {
    el: "#app",
    components: { ChessBoard },
    template: `
      <ChessBoard version="${version}" />
    `
  }
)
window.board = vm.$children[0]