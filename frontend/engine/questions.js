export default class Questions {


    constructor(){

        this.api =
        "https://iceboy1.vercel.app/api/question";

    }



    async getQuestion(settings={}){


        try{


            const response =
            await fetch(

                this.api,

                {

                    method:"POST",

                    headers:{

                        "Content-Type":
                        "application/json"

                    },


                    body:
                    JSON.stringify({

                        difficulty:
                        settings.difficulty || "easy",


                        topic:
                        settings.topic ||
                        "states of matter",


                        location:
                        settings.location ||
                        "Snow Mountain",


                        language:
                        "bilingual"

                    })

                }

            );



            if(!response.ok){

                throw new Error(
                    "API failed"
                );

            }



            return await response.json();



        }



        catch(error){


            console.error(error);



            return this.fallbackQuestion();


        }



    }





    fallbackQuestion(){


        return {


            question_en:
            "What state of matter is ice?",


            question_zh:
            "冰是什麼狀態的物質？",



            choices:[

                {
                    en:"Solid",
                    zh:"固體"
                },

                {
                    en:"Liquid",
                    zh:"液體"
                },

                {
                    en:"Gas",
                    zh:"氣體"
                }

            ],



            answer:0,



            explanation_en:
            "Ice is solid water. When it gets heat, it can melt into liquid water.",



            explanation_zh:
            "冰是固態的水。得到熱能後，冰可以融化成液態的水。"



        };


    }





    async showQuestion(){


        const q =
        await this.getQuestion();



        document
        .querySelector("#question")
        .classList
        .remove("hidden");



        document
        .querySelector("#questionText")
        .innerHTML =

        `
        <b>${q.question_en}</b>
        <br>
        <span>
        ${q.question_zh}
        </span>
        `;



        const answers =
        document.querySelector(
            "#answers"
        );


        answers.innerHTML="";



        q.choices.forEach(
            (choice,index)=>{


                const button =
                document.createElement(
                    "button"
                );


                button.className =
                "answer";


                button.innerHTML =
                `
                ${choice.en}
                <br>
                ${choice.zh}
                `;



                button.onclick=()=>{


                    if(index===q.answer){

                        alert(
                        "Correct! 🎉\n答對了！"
                        );


                    }

                    else{


                        alert(

                        q.explanation_en
                        +
                        "\n\n"
                        +
                        q.explanation_zh

                        );


                    }


                };


                answers.appendChild(button);


            }
        );


    }



}