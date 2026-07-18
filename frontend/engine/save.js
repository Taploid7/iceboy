export default class Save{


save(data){

localStorage.setItem(
"iceboy",
JSON.stringify(data)
);


}



load(){

return JSON.parse(

localStorage.getItem("iceboy")

)

}


}