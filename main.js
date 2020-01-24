const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const platforms = []
const platform_width = 120
const platform_height = 10
const keys = []
let interval = 0
const gravity = 0.98;
let diapers = []
const suelo = 980
let state = 'start'


const images = {
    background:'./images/background.png',
    trollzon:'./images/trollzon.png',
    babytroll:'./images/babytrollamarillo.png',
    diamond:'./images/diamond.png',
    diaper:'./images/diapertroll.png',
    platform:'./images/platform.png',
    startbg: './images/trollzonscreen.png',
    player1Wins:'./images/trollzonscreen.png', //cargar imagen babytrol ganando
    player2Wins:'./images/trollzonscreen.png' //cargar imagen trollzon ganando
}

class Background {
    constructor(backgroundSrc){
        this.x = 0
        this.y = 0
        this.width = canvas.width
        this.height = canvas.height
        this.img = new Image()
        this.img.src = backgroundSrc
        this.img.onload = () => {
          this.draw() 
        }
        this.audio = new Audio()
        this.audio.src = './trollzone.mp3'
        this.audio.loop = true
    }
    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
    drawLife(life){
        ctx.font = "40px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(`Life Trollzon: ${life}`,canvas.width - 400, 100);
    }
}

class Trollzon{
    constructor(x,y){
        this.x = 0
        this.width = 150
        this.height = 205
        this.suelo = suelo - this.height
        this.y = this.suelo
        this.velY = 0;
        this.jumping = false;
        this.jumpStrength = 12;
        this.life = 3
        this.img = new Image()
        this.img.src = images.trollzon
        this.img.onload = () => {
            this.draw()
        }
    }
    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }  
    goRight(){
       if(this.x > canvas.width - this.width) return
        this.x += 10
    }
    goLeft(){
        if(this.x < - 0) return 
        this.x -= 10
    }
    jump() {
        if (!this.jumping) {
          this.velY = -this.jumpStrength * 2;
          this.jumping = true;
        }
    }
    gravity(){
        this.y+=this.velY
        this.velY+=gravity
        if(this.y > this.suelo){
            this.y = this.suelo
            this.velY = 0
            this.jumping = false
        }
    }
    collisionCheck(object) {
        var vectorX = this.x + this.width / 2 - (object.x + object.width / 2);
        var vectorY = this.y + this.height / 2 - (object.y + object.height / 2);
    
        var halfWidths = this.width / 2 - 50 + object.width / 2;
        var halfHeights = this.height / 2 -20 + object.height / 2;
    
        var collisionDirection = null;
    
        if (Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights) {
            var offsetX = halfWidths - Math.abs(vectorX);
            var offsetY = halfHeights - Math.abs(vectorY);
            if (offsetX < offsetY) {
            if (vectorX > 0) {
                collisionDirection = "left";
                this.x += offsetX;
            } else {
                collisionDirection = "right";
                this.x -= offsetX;
                }
            } else {
            if (vectorY > 0) {
                collisionDirection = "top";
                this.y += offsetY;
            } else {
                collisionDirection = "bottom";
                this.y -= offsetY;
                }
            }
        }
        return collisionDirection;
        }
}

class Babytroll{ 
    constructor(x,y){
        this.x = 500
        this.y = 60
        this.width = 200
        this.height = 163
        // this.sx = 100
        // this.sy = 100
        this.img = new Image()
        this.img.src = images.babytroll
        this.img.onload = () => {
            this.draw()
        }
    }
    draw(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
    goRight(){
        if(this.x > canvas.width - 200) return 
         this.x += 10
     }
     goLeft(){
        if(this.x < 0) return 
         this.x -= 10
     }
}

class Diamond{ //la comida tiene que aparecer random en las plataformas 
    constructor(x,y){
        this.x = x
        this.y = y
        this.width = 50
        this.height = 50
        // this.sx = 100
        // this.sy = 100
        this.img = new Image()
        this.img.src = images.diamond
        this.onload = () => {
            this.draw()
        }
    }
    draw(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}

class Diaper{ //el diaper es arrojado por el bebé como si fuera una bala pero para abajo; que sea un arreglo. objeto de pañal y: constante 
    constructor(x,y){
        this.x = x
        this.height = 50
        this.suelo = suelo - this.height
        this.y = y
        this.width = 50
        // this.sx = 100
        // this.sy = 100
        this.img = new Image()
        this.img.src = images.diaper
        this.onload = () => {
            this.draw()
        }
    }
    draw(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
    dropDiaper(){
        this.y+=10
    }
    isOnFloor(){
        console.log(this.suelo)
        if(this.y > this.suelo){
            return true
        } else {
            return false
        }
    }
}
/*----------la platform no tiene clase solo se dibujan--------*/
class Platform{
    constructor(x,y){
        this.x = x
        this.y = y
        this.width = 300
        this.height = 80
        //this.sx = 100
        //this.sy = 100
        this.img = new Image()
        this.img.src = images.platform
        this.onload = () => {
            this.draw()
        }
    }
    draw(){
        ctx.drawImage(this.img, 0, 0,100,50, this.x, this.y, this.width, this.height)
    }
}
let trollzonCharacter = new Trollzon(0, canvas.heigth - 400)
let babytrollCharacter = new Babytroll(0, canvas.heigth - 200)
let trollBackground = new Background(images.startbg)
//guardo un diaper a la hora actual
let throwTime = new Date()

    //plataforma 1
    platforms.push(new Platform(100,550)) 
    //plataforma 2
    platforms.push(new Platform(550,720)) 
    //plataforma 3
    platforms.push(new Platform(1200,680)) 
    //platforma 4
    platforms.push(new Platform(1600,450))
    //plataforma 5
    platforms.push(new Platform(1150,250))

    
let randomPlatform = Math.floor(Math.random() * platforms.length)

const diamondRnd = new Diamond(platforms[randomPlatform].x + platforms[randomPlatform].width/2 , platforms[randomPlatform].y - 70)

function startGame() {
    if (interval) return
    trollBackground.audio.play()
    interval = setInterval(update, 1000 / 60)

    document.body.addEventListener('keydown', e => {
            //para movimiento
        keys[e.keyCode] = true
        })
        
    document.body.addEventListener('keyup', e => {
        keys[e.keyCode] = false
        })
        // if (keys[32]) {
        //     trollBackground.audio.play()
        // }
    } 
      
    function checkPlatformCollition() {
        platforms.forEach(platform => {
            var direction = trollzonCharacter.collisionCheck(platform);

            if (direction == "bottom") {
            trollzonCharacter.jumping = false;
            trollzonCharacter.velY = 0
            } else if (direction == "top") {
            trollzonCharacter.velY = 0;
            trollzonCharacter.jumping = true;
            }
        });
        }


    //tirar pañales 
    function throwDiaper(){
        if(parseInt(new Date() - throwTime)/100 > 5) {
            diapers.push(new Diaper(babytrollCharacter.x + babytrollCharacter.width/2 , babytrollCharacter.y + babytrollCharacter.height/2)) 
            throwTime = new Date()
        }
    }

    function checkDiapersCollition() {
        diapers.forEach(diaper => {
          var direction = trollzonCharacter.collisionCheck(diaper);
            if(direction){
                diapers.splice(diapers.indexOf(diaper),1)
                trollzonCharacter.life--
                if(trollzonCharacter.life <= 0){
                    state = 'player1Wins'
                    trollBackground = new Background(images.player1Wins)
                }
                console.log(trollzonCharacter.life)
            }
        });
      }

    function startScreen(){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        trollBackground.draw()
        if (keys[13]) {
            trollBackground = new Background(images.background)
            state = 'playing'
        }
    }

    function game(){
        //draw objects
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        trollBackground.draw()
        babytrollCharacter.draw()
        trollBackground.drawLife(trollzonCharacter.life)
        for(let p =0; p < platforms.length; p++){
            platforms[p].draw()
        }
        diamondRnd.draw()
        trollzonCharacter.draw()
        for(let d =0; d < diapers.length; d++){
            diapers[d].draw()
        }
        //move characters
        if (keys[39]) {
            trollzonCharacter.goRight()
        }
        
        if (keys[37]) {
            trollzonCharacter.goLeft()
        }
        if (keys[38]) {
            trollzonCharacter.jump();
        }
        
        if (keys[68]) {
            babytrollCharacter.goRight()
        }
        
        if (keys[65]) {
            babytrollCharacter.goLeft()
        }
        
        if(keys[83]){
            throwDiaper()
        }
        trollzonCharacter.gravity()
        
        for(let d =0; d < diapers.length; d++){
            diapers[d].dropDiaper()
            console.log(diapers[d].isOnFloor())
            if(diapers[d].isOnFloor()){
                diapers.splice(diapers.indexOf(diapers[d]),1)
            }
        }
        //collition check
        checkPlatformCollition()
        checkDiapersCollition()
        //collition baby y Trollzon
        if(trollzonCharacter.collisionCheck(babytrollCharacter)){
            state = 'player2Wins'
            trollBackground = new Background(images.player2Wins)
        }
        if(trollzonCharacter.collisionCheck(diamondRnd)){
            trollzonCharacter.life+=1
            let randomPlatform = Math.floor(Math.random() * platforms.length)
            diamondRnd.x = platforms[randomPlatform].x + platforms[randomPlatform].width/2 
            diamondRnd.y = platforms[randomPlatform].y - 70
        }
    }

    function player1Wins(){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        trollBackground.draw()
        if (keys[13]) {
            trollBackground = new Background(images.background) //cargar imagen babt troll ganando
            state = 'playing'
            restartGame()
        }
    }

    function player2Wins(){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        trollBackground.draw()
        if (keys[13]) {
            trollBackground = new Background(images.background) //cargar imagen trollzon ganando
            state = 'playing'
            restartGame()
        }
    }

    function restartGame(){
        trollzonCharacter = new Trollzon(0, canvas.heigth - 400)
        babytrollCharacter = new Babytroll(0, canvas.heigth - 200)
        trollBackground = new Background(images.background)
        diapers = []

    }
    
    function update() {
        frames++
        switch(state) {
            case 'start': 
                startScreen()
                break
            case 'playing':
                game()
                break
            case 'player1Wins':
                player1Wins()  
                break
            case 'player2Wins':
                player2Wins()
                break
        }
    }
document.onmousedown = ()=> startGame()
