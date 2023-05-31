const canvasEl = window.document.querySelector("canvas"), 
canvasCtx = canvasEl.getContext("2d")//com a virgula posso colocar tudo que for const para poupar escrita repetitiva

//el -> coisas a serem inseridas
//ctx -> coisas gerais
// variaveis
const mouse = {
    x: 0,
    y: 0
}


const campo = {
    wd: window.innerWidth,
    ht: window.innerHeight,
    draw: function () {
        canvasCtx.fillStyle = "#286037" //pinta com a cor desejada
        canvasCtx.fillRect(0, 0, this.wd, this.ht)// diz o tamanho da area a ser usada, (inicio em x , inicio em y , final em x , final em y)
    }
}
const midLine = {
    largura: 20,
    inicio_y: 0,
    line_height: campo.ht,
    draw: function () {
        canvasCtx.fillStyle = "#ffffff"
        canvasCtx.fillRect(campo.wd / 2 - this.largura / 2,this.inicio_y, this.largura, this.line_height)
    }
}
const raqueteEsquerda = {
    y : 0,
    h : 180,
    x : 15,
    t : 12,
    _move: function () {
        this.y = mouse.y - this.h /2
    },
    draw: function () {
        canvasCtx.fillStyle = "#ffffff"
        canvasCtx.fillRect(this.x,this.y, this.t,this.h)

        this._move()
    }
}

const raqueteDireita = {
    y : window.innerHeight/ 2 - 90,
    x : window.innerWidth - 30,
    h : 12,
    t : 180,
    speed_raq : 5,
    sobeOUdesce : 1,
    _move: function () {
        this.y += this.sobeOUdesce * this.speed_raq
        if (this.y > campo.ht - this.t){
            this.sobeOUdesce *= -1
        }
        else if (this.y < 0){
            this.sobeOUdesce *= -1
        }

    },
    draw: function () {
        canvasCtx.fillStyle = "#ffffff"
        canvasCtx.fillRect(this.x ,this.y, this.h,this.t)

        this._move()
    }
}
const placar = {
    player_1 : 0,
    player_2 : 0,
    draw: function () {
        canvasCtx.font = "bold 72px Arial"
        canvasCtx.textAlign = "center"
        canvasCtx.textBaseline = "top"
        canvasCtx.fillStyle = "#01341d"
        canvasCtx.fillText(this.player_1,window.innerWidth/ 4, 50)
        canvasCtx.fillText(this.player_2,window.innerWidth/ 4 + window.innerWidth/2 , 50)
    }
}


const bola = {
    x: 500,
    y: 300,
    r: 20,
    speed_nivel: 5,
    directionX: 1,
    directionY: 1,
    _move : function () {
        this.x += this.directionX * this.speed_nivel
        this.y += this.directionY * this.speed_nivel
        if (this.y >= campo.ht - this.r){
            this.directionY *= -1
        }
        else if (this.x >= campo.wd - this.r){
            placar.player_1 += 1
            this.speed_nivel += 5
            raqueteDireita.speed_raq += 2
            raqueteDireita.t += 20
            bola.x = campo.wd / 2 
            bola.y = campo.ht / 2 
            this.directionY *= -1
            this.directionX *= -1
        }
        else if (this.x >= raqueteDireita.x - this.r &&
            this.y >= raqueteDireita.y - this.r &&
            this.y <= raqueteDireita.y + raqueteDireita.t + this.r) {
            this.directionX *= -1;
        }
        
        else if (this.y <=  this.r) {
            this.directionY *= -1
        }
        else if (this.x <= this.r){
            placar.player_2 += 1
            this.speed_nivel += 3
            raqueteDireita.speed_raq += 2
            raqueteDireita.t += 30
            bola.x = campo.wd / 2 
            bola.y = campo.ht / 2 
            this.directionY *= -1
            this.directionX *= -1
        }
        else if (this.x <= raqueteEsquerda.x + raqueteEsquerda.t + this.r &&
            this.y >= raqueteEsquerda.y - this.r &&
            this.y <= raqueteEsquerda.y + raqueteEsquerda.h + this.r) {
            this.directionX *= -1;
        }
        if (placar.player_1 >= 3 || placar.player_2 >= 3) {
            console.log('Fim do jogo!');
            bola.x = campo.wd / 2 
            bola.y = campo.ht / 2  
            canvasCtx.font = "bold 72px Arial"
            canvasCtx.textAlign = "center"
            canvasCtx.textBaseline = "middle"
            canvasCtx.fillStyle = "#00000"
            canvasCtx.fillText('Fim de jogo',window.innerWidth/ 2, window.innerHeight/ 3)
            canvasCtx.fillText('Pressione ESPAÇO para reiniciar',window.innerWidth/ 2, window.innerHeight/ 1.5)
            
            return;
        }
        
    },
    draw:function () {
        canvasCtx.beginPath()
        canvasCtx.fillStyle = "#96AD1F"
        canvasCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);//(x, y, raio, onde inicia no plano cartesiano de traçar o circulo, o quanto o circulo vai girar, sentido anti horario ?)
        canvasCtx.fill()

        this._move()
    }
}


function Setup() { // da para colocar uma variavel igual a outra para que possamos evitar repetiões
    canvasEl.width = canvasCtx.width = campo.wd
    canvasEl.height = canvasCtx.height = campo.ht

}
function Draw(){
    campo.draw()  
    midLine.draw()
    raqueteEsquerda.draw()
    raqueteDireita.draw()
    placar.draw()
    bola.draw()
    

    
}
//API PARA SUAVISAR O MOVIMENTO DA BOLA
window.animateFrame = (function () {
    return(window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame || 
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000/60)
        }
    )
})()

function main() {
    animateFrame(main)
    Draw()
}

Setup()
main()

window.addEventListener('mousemove', function(e) {
    mouse.x = e.pageX
    mouse.y = e.pageY
    
    console.log(mouse)
})

window.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (placar.player_1 >= 3 || placar.player_2 >= 3){
            placar.player_1 = 0;
            placar.player_2 = 0;
            placar.t = 180;
            placar.speed_raq = 5;
            placar.sobeOUdesce = 1;
            raqueteDireita.y = window.innerHeight / 2 - 90;
            raqueteDireita.x = window.innerWidth - 30;
            bola.x = campo.wd / 2;
            bola.y = campo.ht / 2;
            bola.speed_nivel = 5;
            raqueteDireita.speed_raq = 5;
            raqueteDireita.t = 180;
        }
        else{console.log('Tecla de espaço pressionada!')}
        
    }
})