export default class Board{


constructor(game){

this.game=game;


this.player={

x:0,

y:0

};


this.spaces=[

{
name:"Snow Mountain",
x:100,
y:100
},

{
name:"Lake",
x:250,
y:200
},

{
name:"Beach",
x:400,
y:100
}

];


}


draw(){


let canvas=
document.querySelector("canvas");


let ctx=
canvas.getContext("2d");


canvas.width=800;

canvas.height=600;


ctx.font="30px Arial";


this.spaces.forEach(space=>{


ctx.fillText(
"❄",
space.x,
space.y
);


});


ctx.fillText(

"🧊",

this.player.x,

this.player.y

);



}


roll(){


let move=
Math.floor(
Math.random()*6
)+1;


this.player.x+=
move*20;


this.draw();


}



}