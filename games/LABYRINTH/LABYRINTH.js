var direction = "N"
var x = 1
var y = 1
var entity_x = 6
var entity_y = 6
var direction_entity = "N"
var current_img ;
var current_state = '1,1 N'
var entity_state = '6,6 N'
var our_game_data = null;
var bk_audio;
var deplacement;

const audio = document.getElementById('myAudio');

    // Fonction pour démarrer l'audio automatiquement
function playAudio() {
    audio.play();
}

function make_state_key(){
    return '' + x + ',' + y + ' ' + direction
}

function make_state_key_entity(){
    return '' + entity_x + ',' + entity_y + ' ' + direction_entity
}

function make_state_key_entity2(x,y){
    return '' + x + ',' + y + ' ' + 'N'
}

(function() {
  const canvas = document.getElementById('main_canvas');
  const context = canvas.getContext('2d');

  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);
        
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
                
    drawStuff(); 
  }
  
  resizeCanvas();
        
  function drawStuff() {
    try {
    draw_image_on_canvas(current_img);
    }catch {}
  }
})();

function draw_image_on_canvas(img){
        var c = document.getElementById("main_canvas");
        var ctx = c.getContext("2d");
        current_img = img
        ctx.drawImage(img, 0, 0, window.innerWidth, window.innerHeight);
}



function visit_state(){
    console.log("User position : ",current_state);
    draw_image_on_canvas(  our_game_data[current_state]["img_o"] );
}

function load_all_imgs(){
    console.log(our_game_data);
    for (const property in our_game_data) {
        console.log("init load" + property);
        if( our_game_data[property]["img"] != null){
            console.log(our_game_data[property]["img"])
            our_game_data[property]["img_o"] = new Image()
            our_game_data[property]["img_o"].src = our_game_data[property]["img"]
            console.log("init load");
        }
    }

}

function choisirElementAleatoire() {
  const liste = [1,2,3,4,5,6,7,8,9];
  // Obtenir un indice aléatoire entre 0 (inclus) et la longueur de la liste (exclu)
  const indiceAleatoire = Math.floor(Math.random() * liste.length);

  // Retourner l'élément à l'indice aléatoire
  return liste[indiceAleatoire];
}

function deplacement_entity(){
    next_entity_x = choisirElementAleatoire()
    next_entity_y = choisirElementAleatoire()
    next_entity_state = make_state_key_entity2(next_entity_x,next_entity_y)
    if(our_game_data[next_entity_state] == null){
        setTimeout(deplacement_entity,100);
    }
    entity_state = next_entity_state
    entity_x = next_entity_x
    entity_y = next_entity_y
    if(entity_x == x && entity_y == y){
        console.log("game over")
        window.location.href = 'game_over.html';
    }
    console.log("Entity position : ",entity_state)
}

document.addEventListener('keydown', (e) => {
switch (e.key) {
    case "ArrowLeft":
        if( direction == 'N'){
            direction = 'W'
        }else 
        if( direction == 'W'){
            direction = 'S'
        }else
        if( direction == 'S'){
            direction = 'E'
        }else
        if( direction == 'E'){
            direction = 'N'
        }
        break;
    case "ArrowRight":
        if( direction == 'N'){
            direction = 'E'
        }else 
        if( direction == 'E'){
            direction = 'S'
        }else
        if( direction == 'S'){
            direction = 'W'
        }else
        if( direction == 'W'){
            direction = 'N'
        }
        break;
    case "ArrowUp":
        // Up pressed
        if(direction == "N"){
            y = y + 1;
            if (our_game_data[make_state_key()] == null){
                y = y - 1;
            }
        }
        else if(direction == "E"){
            x = x + 1;
            if (our_game_data[make_state_key()] == null){
                x = x - 1;
            }
        }
        else if(direction == "W"){
            x = x - 1;
            if (our_game_data[make_state_key()] == null){
                x = x + 1;
            }
        }
        else if(direction == "S"){
            y = y - 1;
            if (our_game_data[make_state_key()] == null){
                y = y + 1; 
            }
        }    
        break;
    case "ArrowDown":
        // Down pressed
        if(direction == "S"){
            y = y + 1;
            if (our_game_data[make_state_key()] == null){
                y = y - 1;
            }
        }
        else if(direction == "W"){
            x = x + 1;
            if (our_game_data[make_state_key()] == null){
                x = x - 1;
            }
        }
        else if(direction == "E"){
            x = x - 1;
            if (our_game_data[make_state_key()] == null){
                x = x + 1;
            }
        }
        else if(direction == "N"){
            y = y - 1;
            if (our_game_data[make_state_key()] == null){
                y = y + 1; 
            }
        }
        break;
    }
  current_state = make_state_key();
  visit_state();
});

$( document ).ready(function() {
    setTimeout(function(){

        $.getJSON( "map_def.json", function( data ) {
            console.log(data);
            our_game_data = data;
            load_all_imgs();
            playAudio();
            setInterval(deplacement_entity,10000)
            setTimeout(visit_state, 1000);
        });
      }, 1000);    

});
