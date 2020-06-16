
window.addEventListener('DOMContentLoaded', (event) =>{


    let keysPressed = {}

    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
     });
     
     document.addEventListener('keyup', (event) => {
         delete keysPressed[event.key];
      });




    let tutorial_canvas = document.getElementById("tutorial");
    let tutorial_canvas_context = tutorial_canvas.getContext('2d');


    tutorial_canvas.style.background = "#000000"


    class Rectangle {
        constructor(x, y, height, width, color) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
        }
        draw(){
            tutorial_canvas_context.fillStyle = this.color
            tutorial_canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move(){
            this.x+=this.xmom
            this.y+=this.ymom
        }
    }
    class Circle{
        constructor(x, y, radius, color, xmom = 0, ymom = 0){

            this.height = 0
            this.width = 0
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
        }       
         draw(){
            tutorial_canvas_context.lineWidth = 0
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.beginPath();
            tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
            tutorial_canvas_context.fillStyle = this.color
           tutorial_canvas_context.fill()
            tutorial_canvas_context.stroke(); 
        }
        move(){
            this.x += this.xmom
            this.y += this.ymom
        }
    }

    class Observer{
        constructor(){
            this.body = new Circle( 300, 500, 10, "white")
            this.ray = []
            this.rayrange = 320
            this.globalangle = Math.PI
            this.gapangle = Math.PI/4.5
            this.edge1 = new Circle(0,0,10,"red")
            this.edge2 = new Circle(0,0,10,"red")
            this.currentangle = 0
            this.obstacles = []


        }
        beam(){

            this.currentangle  = this.gapangle/2

            for(let k = 0; k<1000; k++){

                this.currentangle+=(this.gapangle/500)
                let ray = new Circle(this.body.x, this.body.y, 1, "white",((this.rayrange * (Math.cos(this.globalangle+this.currentangle))))/this.rayrange*2, ((this.rayrange * (Math.sin(this.globalangle+this.currentangle))))/this.rayrange*2 )
       
            ray.collided = 0
            ray.lifespan = this.rayrange-1
            this.ray.push(ray)

            }

            for(let f = 0; f<this.rayrange/2; f++){
                for(let t = 0; t<this.ray.length; t++){
                    if(this.ray[t].collided == 1){
                        
                    }else{
                        this.ray[t].move()

                    this.ray[t].lifespan--
                    if(this.ray[t].lifespan <= 0){
                        this.collided = 1
                    }
                    for(let q = 0; q<this.obstacles.length; q++){
                        if(this.ray[t].x > this.obstacles[q].x){
                            if(this.ray[t].y > this.obstacles[q].y){
                                if(this.ray[t].x < this.obstacles[q].x+this.obstacles[q].width){
                                    if(this.ray[t].y < this.obstacles[q].y+this.obstacles[q].height){
                                        this.ray[t].collided = 1
                                    }
                                }
                            }
                        }
                        if(intersects(this.obstacles[q], this.ray[t])){
                            this.ray[t].collided = 1
                        }
                    }
                    }
                }
            }

        }
        draw(){

            this.beam()
            this.body.draw()
            tutorial_canvas_context.beginPath()
            tutorial_canvas_context.moveTo(this.body.x, this.body.y)

            for(let y = 0; y<this.ray.length; y++){
            tutorial_canvas_context.lineTo(this.ray[y].x, this.ray[y].y)
            }
            tutorial_canvas_context.stroke()
            tutorial_canvas_context.fillStyle = "red"
            tutorial_canvas_context.fill()
            this.ray =[]
        }
        control(){

            if(keysPressed['t']){
                this.globalangle += .05
            }
            if(keysPressed['r']){
                this.globalangle -= .05
            }
            if(keysPressed['w']){
                this.body.y-=2
            }
            if(keysPressed['d']){
                this.body.x+=2
            }
            if(keysPressed['s']){
                this.body.y+=2
            }
            if(keysPressed['a']){
                this.body.x-=2
            }

        }

    }

    let examplecircle = new Circle(100,100, 10, "red")
    let examplerectangle = new Rectangle(300,100, 20, 20, "blue")
    let examplerectangle2 = new Rectangle(100,300, 100, 20, "blue")

    let observer = new Observer()
    observer.obstacles.push(examplerectangle)
    observer.obstacles.push(examplerectangle2)
    observer.obstacles.push(examplecircle)

    for(let k = 0; k<3; k++){
        let examplerectangle3 = new Rectangle(Math.random()*tutorial_canvas.width,Math.random()*tutorial_canvas.height, 5+Math.random()*70, 5+Math.random()*70, "blue")
        let examplecircle2 = new Circle(Math.random()*tutorial_canvas.width,Math.random()*tutorial_canvas.height,  4+Math.random()*5, getRandomLightColor())
 
        observer.obstacles.push(examplerectangle3)
        observer.obstacles.push(examplecircle2)

    }

    window.setInterval(function(){ 
        tutorial_canvas_context.clearRect(0, 0, tutorial_canvas.width, tutorial_canvas.height)  
        observer.draw()
        observer.control()
        for(let p = 0; p<observer.obstacles.length; p++){
            observer.obstacles[p].draw()
        }
    }, 14) 

    function intersects(circle, left) {
        var areaX = left.x - circle.x;
        var areaY = left.y - circle.y;
        return areaX * areaX + areaY * areaY <= circle.radius * circle.radius*1.1;
    }


// random color that will be visible on  black background
function getRandomLightColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[(Math.floor(Math.random() * 15)+1)];
    }
    return color;
  }

    
})