// Beni <3 Karlish
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const platforms = []
const platform_width = 120
const platform_height = 10

const images = {
    background:'',
    trollzon:'',
    babytroll:'',
    food:'',
    diaper:'',
    floor:'',
    platform:''
}

class Background {
    constructor(){
        this.x = 0
        this.y = 0
        this.width = canvas.width
        this.height = canvas.height
        this.img = new Image()
        this.img.src = images.background
        this.img.onload = () => {
          this.draw() 
        }
        this.audio = new Audio()
        this.audio.src = ''
        this.audio.loop = true
    }
    draw() {
        if (this.x < -canvas.width) this.x = 0
        // this.x--
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
        // ctx.drawImage(this.img,this.x + this.width,this.y,this.width,this.height)
    }
}

class Trollzon{
    constructor(x,y){
        this.x = x
        this.y = y
        this.width = 100
        this.height = 100
        this.sx = 100
        this.sy = 100
        this.img = new Image()
        this.img.src = images.trollzon
        this.img.onload = () => {
            this.draw()
        }
    }
    draw() {
        ctx.drawImage(this.img, this.x,this.y, this.width, this.height, this.sx, this.sy)
    }  
    goRigth(){
       if(this.x > canvas.width - 100) return 
        this.x += 10
        this.move() //falta crear la función de move
    }
    goLeft(){
        this.x -= 10
        this.move() //falta crear la función de move
    }
    jump(){

    }
}

//el babytroll juega por la compu si es solo un jugador - pero es preferible que sean los dos jugadores 
class Babytroll{ 
    constructor(x,y){
        this.x = x
        this.y = y
        this.width = 100
        this.height = 100
        this.sx = 100
        this.sy = 100
        this.img = new Image()
        this.img.src = images.babytroll
        this.img.onload = () => {
            this.draw()
        }
    }
    draw(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height, this.sx, this.sy)
    }
    goRigth(){
        if(this.x > canvas.width - 100) return 
         this.x += 10
         this.move() //falta crear la función de move
     }
     goLeft(){
         this.x -= 10
         this.move() //falta crear la función de move
     }
     isTouching(obstacle){ //falta crear check collitions
        return (
          this.x < obstacle.x + obstacle.width &&
          this.x + this.width > obstacle.x &&
          this.y < obstacle.y + obstacle.height &&
          this.y + this.height > obstacle.y
        )
      }
}

class Food{ //la comida tiene que aparecer random en las plataformas 
    constructor(x,y){
        this.x = x
        this.y = y
        this.width = 50
        this.height = 50
        this.sx = 100
        this.sy = 100
        this.img = new Image()
        this.img.src = images.food
        this.onload = () => {
            this.draw()
        }
    }
    draw(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height, this.sx, this.sy)
    }
}

class Diaper{ //el diaper es arrojado por el bebé como si fuera una bala pero para abajo; que sea un arreglo. objeto de pañal y: constante 
    constructor(x,y){
        this.x = x
        this.y = y
        this.width = 50
        this.height = 50
        this.sx = 100
        this.sy = 100
        this.img = new Image()
        this.img.src = images.diaper
        this.onload = () => {
            this.draw()
        }
    }
    draw(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height, this.sx, this.sy)
    }
}
/*----------la platform no tiene clase solo se dibujan--------*/
class Platform{
    constructor(x,y){
        this.x = x
        this.y = y
        this.width = 50
        this.height = 50
        this.sx = 100
        this.sy = 100
        this.img = new Image()
        this.img.src = images.platform
        this.onload = () => {
            this.draw()
        }
    }
    draw(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height, this.sx, this.sy)
    }
}

    platforms.push({
        x: canvas.width - 170,
        y: 400,
        width: platform_width,
        height: platform_height
    })
    
    platforms.push({
        x: 200,
        y: canvas.height - 50,
        width: platform_width,
        height: platform_height
    })
    
    platforms.push({
        x: 400,
        y: 400,
        width: platform_width,
        height: platform_height
    })
    
    platforms.push({
        x: canvas.width - 170,
        y: canvas.height - 50,
        width: platform_width,
        height: platform_height
    })
    
    platforms.push({
        x: -canvas.width,
        y: canvas.height - 5,
        width: canvas.width + canvas.width * 2,
        height: platform_height
    })

