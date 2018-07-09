
//  <h2>{{ title }} v. {{ version }}</h2>


<template>
  <div v-bind:title="decoratedVersion" @dragover.prevent="onDragOver">
    <!--<h2>{{ decoratedVersion }}</h2>-->
    <div style="display: flex;" v-for="y in 8" v-bind:key="y" @dblclick.stop="flip($event)">
      <div 
        style="display: flex; flex-direction: row; align-self: center; justify-content: center;" 
        v-for="x in 4" v-bind:key="x"
      >
        <div 
          :style="getStyle(getIndex(y, x))" 
          :data-index="getIndex(y, x)"
          @click="onSqClick(getIndex(y, x))"
          @drop="onSqClick(getIndex(y, x))"
        >
          <img
            draggable="true" 
            v-if="position[getIndex(y,x)] !== '0'"  
            width="100%" 
            height="100%"
            :src="sets[chessSet][position[getIndex(y,x)]]" 
            :style="{cursor: 'pointer', opacity: getOpacity(getIndex(y,x))}" 
            @dragstart="onDragStart(getIndex(y, x), $event)" 
            @dragend = "onDragEnd" 
          />
        </div> 
        <div
          :style="getStyle(getIndexPlus(y, x))" 
          :data-index="getIndexPlus(y, x)"
          @click="onSqClick(getIndexPlus(y, x))"
          @drop="onSqClick(getIndexPlus(y, x))"
        >
          <img  
            draggable="true" 
            v-if="position[getIndexPlus(y, x)] !== '0'"  
            width="100%" 
            height="100%" 
            :src="sets[chessSet][position[getIndexPlus(y, x)]]"
            :style="{cursor: 'pointer', opacity: getOpacity(getIndexPlus(y,x))}"
            @dragstart="onDragStart(getIndexPlus(y, x), $event)"
            @dragend = "onDragEnd" 
          />
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
  import chessSets from './chess-sets'
  export default {
    name: "ChessBoard",
    props: {
      version: {type: String, required: false, default: '1.0.0'},
      initialLightBg: {type: String, required: false, default: '#F0D9B5'},
      initialDarkBg: {type: String, required: false, default: '#B58863'},
      initialFlipped: {type: Boolean, required: false, default: false},
      initialPos: {type: String, required: false, default: "RNBQKBNRPPPPPPPP00000000000000000000000000000000pppppppprnbqkbnr"},
      initialChessSet: {type: String, required: false, default: 'default'},
      },
    data: function() {
      return {
        title: "Vue Chessboard",
        sets: chessSets,
        lightBg: this.initialLightBg,
        darkBg: this.initialDarkBg,
        flipped: this.initialFlipped,
        lightSqStyle: {textAlign: 'center', width: '10vh', height: '10vh', backgroundColor: this.initialLightBg},
        darkSqStyle: {textAlign: 'center', width: '10vh', height: '10vh', backgroundColor: this.initialDarkBg},
        selectedSqStyle: {textAlign: 'center', width: '10vh', height: '10vh', backgroundColor: '#00f0f0'},
        emptyPos: "0".repeat(64),
        position: this.initialPos,
        chessSet: this.initialChessSet,
        sqFrom: -1,
        isDragging: false
      } 
    },
    methods: {
      reset: function() {this.position = this.initialPos},
      empty: function() {this.position = this.emptyPos},
      onDragOver: function() {/* Do nothing */},
      getIndex: function(y, x) {
        return ((y-1) * 8 + (x - 1) * 2) ^ (this.flipped ? 7 : 56)
      },
      getIndexPlus: function(y, x) {
        return (((y-1) * 8 + (x - 1) * 2) ^ (this.flipped ? 7 : 56)) + (this.flipped ? -1 : 1)
      },
      getRow: function(n) {
        return Math.floor(n / 8)
      },
      getCol: function(n) {
        return n % 8
      },
      isOdd: function(n) {
        return !!(n % 2)
      },
      isLight: function(n) {
        return (this.isOdd(this.getRow(n)) && !this.isOdd(this.getCol(n))) || 
        (!this.isOdd(this.getRow(n)) && this.isOdd(this.getCol(n)))
      },
      flip: function(ev) {
        if (ev && ev.preventDefault) {
//console.log("Preventing default behaviour.")
            ev.preventDefault()
          }
        this.flipped = !this.flipped
      }, 
      setBg: function(light, dark) {
        this.lightSqStyle.backgroundColor = light || this.initialLightBg
        this.darkSqStyle.backgroundColor = dark || this.initialDarkBg
      },
      move: function(from, to, promotion) {
        let currPos = this.position.split('')
        currPos[from] = '0'
        currPos[to] = promotion ? promotion : this.position[from]
        this.position = currPos.join('')
      },
      isSqEmpty: function(index) {
        return this.position[index] === '0'
      },
      isSqSelected: function(index) {
        return this.sqFrom === index
      },
      getStyle: function(index) {
        return this.isSqSelected(index) ? this.selectedSqStyle : 
          this.isLight(index) ? this.lightSqStyle : this.darkSqStyle
      },
      onDragStart: function(index, ev) {
        // console.log(`onDragStart ${index}`)
        // console.log(ev.target.offsetWidth)

        let size = ev.target.offsetWidth
        // console.log(`Image size is: ${size}`) 
        let pos = size / 2
        let ctx = document.createElement('canvas').getContext('2d')
        ctx.canvas.width = size 
        ctx.canvas.height = size
        let img = new Image()
        img.src = ev.target.src
        ctx.drawImage(img, 0, 0, size / 4, size / 4)
        ev.dataTransfer.setDragImage(ctx.canvas, pos, pos)
        this.isDragging = true
        this.sqFrom = -1
        this.onSqClick(index)
      },
      onDragEnd: function(ev) {
//console.log(`Setting isDragging (${this.isDragging}) to false`)
        this.isDragging = false
      },
      getOpacity: function(index) {
        let op = (index === this.sqFrom) && this.isDragging ? 0 : 1
        if (op === 0) {
//console.log(`Opacity of square ${index} should be set to 0`)
        }
        return op
      },
      onSqClick: function(index) {
        //console.log(`Clicked on ${index}`)
        if (this.sqFrom === -1) {
          if (this.isSqEmpty(index)) {
            return -1
          } else {
            return this.sqFrom = index
          }
        } else {
          if (this.sqFrom === index) {
            return this.sqFrom = -1
          } else {
            this.move(this.sqFrom, index)
            return this.sqFrom = -1
          }
        }
      }
    },
    computed: {
      decoratedVersion: function() {return `${this.title} v. ${this.version}`},
      computedLightBg: function() {return this.lightBg || this.initialLightBg},     
      computedDarkBg: function() {return this.darkBg || this.initialDarkBg}     
    }
  }
</script>

