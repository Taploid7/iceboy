export default class Dialogue{


show(
speaker,
text
){


let box=
document.querySelector("#dialogue");


box.classList.remove("hidden");


document.querySelector("#speaker")
.innerHTML=speaker;


document.querySelector("#text")
.innerHTML=text;



}


hide(){

document
.querySelector("#dialogue")
.classList.add("hidden");

}


}