export default class Cutscene{


async play(scene){


for(let action of scene){


if(action.type==="dialog"){


this.dialogue.show(
action.speaker,
action.text
);


await new Promise(
r=>
document
.querySelector("#continue")
.onclick=r
);


}


}


}



}