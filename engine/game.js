import Board from "./board.js";
import Dialogue from "./dialogue.js";
import Questions from "./questions.js";
import Save from "./save.js";


export default class Game{


constructor(){

this.board =
new Board(this);


this.dialogue =
new Dialogue();


this.questions =
new Questions();


this.save =
new Save();


}



start(){

this.board.draw();

}


}