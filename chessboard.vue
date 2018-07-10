
//  <h2>{{ title }} v. {{ version }}</h2>


<template>
  <div style="width: 100%" v-bind:alt="decoratedVersion" @dragover.prevent="status_msg = status_msg + ' - Dragging over the main div'">
    <h4 v-if="debug">{{ status_msg }}</h4>
    <div style="display: flex; width: 100%" v-for="y in 8" v-bind:key="y" @dblclick.stop.cancel="flip($event)">
      <div 
        style="width: 100%; display: flex; flex-direction: row; align-self: center; justify-content: center;" 
        v-for="x in 4" v-bind:key="x"
      >
        <div
          class="square"
          droppable 
          :style="getStyle(getIndex(y, x))" 
          :data-index="getIndex(y, x)"
          @dragenter.prevent="onDragOver(getIndex(y, x))"
          @dragover.prevent="onDragOver(getIndex(y, x))"
          @click="onSqClick(getIndex(y, x))"
          @drop.prevent.stop.cancel="onSqDrop(getIndex(y, x))"
        >
          <img
            draggable="true" 
            v-if="position[getIndex(y,x)] !== '0'"  
            width="100%" 
            height="100%"
            :src="sets[chessSet][position[getIndex(y,x)]]" 
            :style="{cursor: 'pointer', opacity: getOpacity(getIndex(y,x)), mozOpacity: getOpacity(getIndex(y,x))}" 
            @dragstart="onDragStart(getIndex(y, x), $event)" 
            @dragend = "onDragEnd(getIndex(y,x))" 
          />
        </div> 
        <div
          class="square"
          droppable
          :style="getStyle(getIndexPlus(y, x))" 
          :data-index="getIndexPlus(y, x)"
          @dragenter.prevent="onDragOver(getIndexPlus(y, x))"
          @dragover.prevent="onDragOver(getIndexPlus(y, x))"
          @click="onSqClick(getIndexPlus(y, x))"
          @drop.prevent.stop.cancel="onSqDrop(getIndexPlus(y, x))"
        >
          <img  
            draggable="true" 
            v-if="position[getIndexPlus(y, x)] !== '0'"  
            width="100%" 
            height="100%" 
            :src="sets[chessSet][position[getIndexPlus(y, x)]]"
            :style="{cursor: 'pointer', opacity: getOpacity(getIndexPlus(y,x)), mozOpacity: getOpacity(getIndexPlus(y,x))}"
            @dragstart="onDragStart(getIndexPlus(y, x), $event)"
            @dragend = "onDragEnd(getIndexPlus(y,x))" 
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
      initialSelectedBg: {type: String, required: false, default: '#bde6ed'},
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
        selectedBg: this.initialSelectedBg,
        lightBg: this.initialLightBg,
        darkBg: this.initialDarkBg,
        flipped: this.initialFlipped,
        emptyPos: "0".repeat(64),
        position: this.initialPos,
        chessSet: this.initialChessSet,
        sqFrom: -1,
        sqTo:-1,
        isDragging: false,
        isMounted: false,
        status_msg: 'Mensajes de depuración',
        debug: true
      } 
    },
    mounted: function() {
      this.$nextTick(function() {
        this.isMounted = true
        let board = this
        this.status_msg = this.decoratedVersion
        window.addEventListener('resize', () => {board.$forceUpdate()})
      })
    },
    methods: {
      reset: function() {this.position = this.initialPos},
      empty: function() {this.position = this.emptyPos},
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
        this.flipped = !this.flipped
      }, 
      setBg: function(light, dark) {
        this.lightBg = light || this.initialLightBg
        this.darkBg = dark || this.initialDarkBg
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
      getSqHeight: function() {
        if (!this.isMounted) return '5vw'
        let sq0 = document.getElementsByClassName('square')[0]
        // console.log(`Square height should be ${sq0.offsetWidth}px`)
        return  `${sq0.offsetWidth}px`
      },
      getSqStyle: function() {
        return {textAlign: 'center', width: '100%', height: this.getSqHeight()}
      },
      getStyle: function(index) {
        return this.isSqSelected(index) ? this.getSelectedSqStyle() : 
          this.isLight(index) ? this.getLightSqStyle() : this.getDarkSqStyle()
      },
      getOpacity: function(index) {
        let op = (index === this.sqFrom) && this.isDragging ? 0 : 1
        if (op === 0) {
        }
        return op
      },
      getLightSqStyle: function() {
        let tempStyle = this.getSqStyle()
        tempStyle.backgroundColor = this.lightBg
        return tempStyle
      },
      getDarkSqStyle: function() {
        let tempStyle = this.getSqStyle()
        tempStyle.backgroundColor = this.darkBg
        return tempStyle
      },
      getSelectedSqStyle: function() {
        let tempStyle = this.getSqStyle()
        tempStyle.backgroundColor = this.selectedBg
        return tempStyle
      },
      onDragStart: function(index, ev) {
        let ctx
        this.status_msg = `Dragging from square ${index}`
        let size = ev.target.offsetWidth
        let pos = size / 2
        if (navigator.userAgent.match(/Firefox/)) {
          ctx = document.createElement("http://www.w3.org/1999/xhtml","canvas").getContext('2d')
        } else {
          ctx = document.createElement("canvas").getContext('2d')
        }
        ctx.canvas.width = size 
        ctx.canvas.height = size
        let img = new Image()
        img.src = ev.target.src
        ctx.drawImage(img, 0, 0, size, size)
        ev.dataTransfer.setData("text/plain", index)
        ev.dataTransfer.setDragImage(ctx.canvas, pos, pos)
        this.isDragging = true
        this.sqFrom = -1
        this.onSqClick(index)
        return true
      },
      onMouseMove: function(index) {
        if (navigator.userAgent.match(/Firefox/) && this.isDragging) {
          this.onDragOver(index)
          return true
        } else {
          return false
        }
      },
      onDragOver: function(index) {
        this.sqTo = index
        this.status_msg = `Dragging over ${this.sqTo}`
      },
      onMouseUp: function(index) {
          if (navigator.userAgent.match(/Firefox/) && this.isDragging) {
            this.onDragEnd(index)
            this.onSqDrop(index)
            return true
          } else {
            return false
          }
      },
      onDragEnd: function(index) {
        let currSqTo = this.sqTo
        setTimeout(() => {this.status_msg = `Ending dragging from square ${index} to square ${currSqTo}`}  , 1000)
        this.isDragging = false
      },
      onSqClick: function(index) {
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
      },
      onSqDrop: function(index) {
        this.status_msg = `Dropping on square ${index}`
        this.onSqClick(index)
      },
    },
    computed: {
      decoratedVersion: function() {return `${this.title} v. ${this.version}`},
    }
  }
</script>

