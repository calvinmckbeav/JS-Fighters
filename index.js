// slecting the canvas elements from html and making it a variable
const canvas = document.querySelector('canvas')
// c stands for context
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

// fillRect(x pos, y pos, canvas width, canvas height)
c.fillRect(0, 0, canvas.width, canvas.height)


// gravity constant
const gravity = 0.5

// character sprites, color is defaulted red but eaily overriden
// when creating instance
class Sprite {
  constructor({position, velocity, color = 'blue', offset}) {
    // starting position
    this.position = position
    this.velocity = velocity
    this.height = 150
    this.width = 50
    this.color = color
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: offset,
      width: 100,
      height: 50
    }
  this.isAttacking
  this.health = 100
  }

  // draws character on screen
  draw() {
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, this.width, this.height)

    // attackBox
    if (this.isAttacking) {
      c.fillStyle = 'gold'
      c.fillRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.width,
      this.attackBox.height
    )
  }
}

  // updates character's appearance and position
  update() {
    this.draw()
    this.attackBox.position.x = this.position.x - this.attackBox.offset.x
    this.attackBox.position.y = this.position.y
    this.position.y += this.velocity.y
    this.position.x += this.velocity.x

    // stops sprite from falling if he's at bottom of screen, makes them fall
    // faster if they're in the air due to gravity
    if (this.position.y + this.height + this.velocity.y>= canvas.height) {
      this.velocity.y = 0
    } else this.velocity.y += gravity
  }

  // attack function
  attack() {
    this.isAttacking = true
    // setTimeout waits 100 milliseconds then sets isAttacking to false
    setTimeout(() => {
      this.isAttacking = false
    }, 100)

  }
}
// creating user's character
const player = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  // by default, the characters won't be moving, but these values will change
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  }
})

// creating enemy character
const enemy = new Sprite({
  position: {
    x: canvas.width - 50,
    y: 0
  },
  velocity: {
    x: 0,
    y: 10
  },
  color: 'red',
  offset: {
    x: 50,
    y: 0
  }
})

// keys for left character
const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  }
}

// keys for right character
const enemyKeys = {
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  }
}

// variables that hold the last key pressed for left (lastKey) and right
// (enemyLast) characters
let lastKey
let enemyLast

// logic to determine who won
function whoWon() {
  clearTimeout(timerID)
  window.removeEventListener('keydown', keyDown)
  window.removeEventListener('keyup', keyUp)
  if (player.health == enemy.health) {
    document.querySelector('#result').innerHTML = "TIE"
    document.querySelector('#result').style.display = "flex"
  }
  else if (player.health > enemy.health) {
    document.querySelector('#result').innerHTML = "PLAYER 1 WINS"
    document.querySelector('#result').style.display = "flex"
  } else {
    document.querySelector('#result').innerHTML = "ENEMY WINS"
    document.querySelector('#result').style.display = "flex"
  }
}

let timer = 60
let timerID
function decreaseTimer() {
  if (timer > 0) {
    timerID = setTimeout (decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }
  if (timer ==0){
    whoWon()
  }
}
decreaseTimer()

// infinite loop of the window updating frames
function animate() {
  window.requestAnimationFrame(animate)
  // fillStyle changes the next fillRect to that color, so we change it to
  // black right before clearing the background to make sure it's black.
  // everytim we call update it changes fillStyle to red
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

// changing x velocity values for the characters
player.velocity.x = 0
  if (keys.a.pressed && lastKey === 'a') {
    player.velocity.x = -3
  } else if (keys.d.pressed && lastKey === 'd') {
    player.velocity.x = 3
  }
enemy.velocity.x = 0
  if (enemyKeys.ArrowRight.pressed && enemyLast === 'ArrowRight') {
    enemy.velocity.x = 3
  } else if (enemyKeys.ArrowLeft.pressed && enemyLast === 'ArrowLeft') {
    enemy.velocity.x = -3
  }

  // detect for collision w player attack
  if (rectangularCollision({rectangle1: player,
      rectangle2: enemy})) {
        player.isAttacking = false
        enemy.health -= 10
        document.querySelector("#enemyHealth").style.width = enemy.health + "%"
      }
  if (rectangularCollision({rectangle1: enemy,
        rectangle2: player})) {
          enemy.isAttacking = false
          player.health -= 10
          document.querySelector('#playerHealth').style.width = player.health + '%'
        }

  // ending game is someone's health is 0
  if (player.health <= 0 || enemy.health <= 0){
    whoWon()
  }
}

function rectangularCollision({rectangle1, rectangle2}) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
    && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
    && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
    && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    && rectangle1.isAttacking
  )
}

animate()

// window listening for a key down
window.addEventListener('keydown', keyDown)

function keyDown(event) {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break
    case 'w':
      if (player.position.y + player.height === canvas.height) {
      player.velocity.y = -13
      }
      break
    case ' ':
      player.attack()
      break
    case 'ArrowRight':
      enemyKeys.ArrowRight.pressed = true
      enemyLast = 'ArrowRight'
      break
    case 'ArrowLeft':
      enemyKeys.ArrowLeft.pressed = true
      enemyLast = 'ArrowLeft'
      break
    case 'ArrowUp':
      if (enemy.position.y + enemy.height === canvas.height) {
      enemy.velocity.y = -13
    }
      break
    case 'ArrowDown':
      enemy.attack()
      break
    }
  }

// window listening for when a key is released
window.addEventListener('keyup', keyUp)

function keyUp(event) {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 'ArrowRight':
      enemyKeys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      enemyKeys.ArrowLeft.pressed = false
      break
  }
}
