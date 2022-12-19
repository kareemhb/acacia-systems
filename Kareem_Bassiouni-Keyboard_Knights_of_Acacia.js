
// MIMICKING AN OBJECT RETURNED FROM AN API CALL.
// ASSUMING THE INDIVIDUAL KEY POSITION IS NOT PROVIDED FOR EACH KEY. INSTEAD, THE NUMBER OF BLANK KEY SPACES AT THE BEGINNING OF EACH ROW IS PROVIDED FOR THE KEY POSITION TO BE CALCULATED.
// KEYBOARD ROWS ARE PROVIDED IN THE RIGHT ORDER IN THE OBJECT.
const kb_rows =  [
    {
      keys: ["a","b","c","d","e"],
      start: 0
    },
    {
      keys:  ["f","g","h","i","j"],
      start: 0
    },
    {
      keys:  ["k","l","m","n","o"],
      start: 0
    },
    {
      keys:  ["1","2","3"],
      start: 1
    }
  ];






//DEFINE number_of_movesconstraints (OBJECTIFIED OUT OF FUNCTIONS FOR EASE OF MAINTAINANCE AND SCALABILITY)
const number_of_movesconstraints = {
  
  //maximum number of vowels allowed per sequence 
  max_vowels      : 2, 
  
  //number of moves required per sequence
  move_count      :10, 
  
  //moves allowed within a sequence [Row, Column]
  moves_allowed   : [  //knight moves
      [-2,-1], // ↰ up-left
      [-2,1],  // ↱ up-right
      [2,-1],  // ↲ down-left
      [2,1],   // ↳ down-right
      [-1,2],  // ⬏ right-up
      [1,2],   // ⬎ right-down
      [-1,-2], // ⬑ left-up
      [1,-2],  // ⬐ left-down
    ]
}







//CALCULATES THE POSITION FOR ANY GIVEN KEY
function calc_key_position(k){

  //loop rows to find key
  for (let r = 0; r < kb_rows.length; ++r){
    const row = kb_rows[r];
    const key_index = row.keys.indexOf(k);

    //if key is found in the row, get the position and stop the loop
    if(key_index > -1){
      //exit the loop and return position
      return {
        r: r,
        c: (key_index + row.start)
      };
    }
  }
  
  //key doesn't exist on keyboard
  return false;
}






//LISTS ALL POSSIBLE MOVES WITHIN THE BOUNDARIES OF THE KEYBOARD AND THE ALLOWED MOVES DECLARED IN THE CONTRAINT GLOBAL OBJECT
function key_next_moves(key,moves=number_of_movesconstraints.moves_allowed){
  const position = calc_key_position(key);
  
  if(position){
    let next_moves = [];
    
    //test potential moves
    moves.forEach(function(move){
      //check if potential row exits
      const move_row = kb_rows[(position.r + move[0])];
      if(move_row !== undefined){
        //check if potential column exists
        const move_column = move_row.keys[(position.c + move[1] - move_row.start)];
        if(move_column !== undefined){
          //add key to possible moves array
          next_moves.push(move_column);
        }                            
      }
    });
    
    //return all possible moves
    return next_moves;
  }
  
  //start key doesn't exist on keyboard 
  return false;
}






//VALIDATES THE VOWELS CONSTRAINT
function vowel_pass(key,sequence, max_count=number_of_movesconstraints.max_vowels){
  
  //checks if a key is a vowel
  const vowel_key = function(k) {
    return (/^[aeiou]$/i).test(k);
  }
  
  //counts vowels in an sequence array
  const vowel_count = function(s){
    let count = 0;
    s.forEach(function(k){
      if(vowel_key(k)){
        count++;
      }
    });
    return count;
  }
  
  //check contraint
  return vowel_key(key) && vowel_count(sequence) == max_count ? false : true;
  
}






//UPDATES ARRAY OF SEQUENCES 
//ADDS ONE KEY MOVE TO SEQUENCES OF ANY SIZE
function sequence_next_moves(current_sequence){
  
  //determine possible keys in a new sequence
  const last_key = current_sequence[current_sequence.length - 1];
  const next_keys = key_next_moves(last_key);
  
  //check if keyboard key exist
  if(next_keys){

    //build new sequences
    let new_sequences = [];

    next_keys.forEach(function(next_key){
      //apply vowels constraint (as declared in the number_of_movesconstraints global object)
      if(vowel_pass(next_key,current_sequence)){
        new_sequences.push(current_sequence.concat([next_key]));
      }
    });
    //return updated valid sequences
    //empty array = all next_keys found don't pass the vowels constraint
    return new_sequences;
  }

  //start key doesn't exist on keyboard; OR
  //no subsequent moves are found based on number_of_movesconstraints declared in the number_of_movesconstraints global object
  return false;
  
}






//CALLS FUNCTIONS ABOVE TO COUNT ALL POSSIBLE SEQUENCES FOR ANY KEY AND FOR ANY NUMBER OF KEY-SEQUENCES WITHIN THE DEFINED number_of_movesconstraints
function count_all_sequences(key,number_of_keys=number_of_movesconstraints.move_count){
  
  //ignore case-sensitivity
    // since, a keyboard physical key would typically be used for the same character lower-case and upper-case,
    // and the keyboard doesn't have a "Caps Lock" button;
    // then, the case-sensitivity of the keyboard input is ignored.
  const low_key = key.toLowerCase();
  
  //variable is used to store new sequences after adding the next keys in MOVES iterations, if any
  //start key declared as the single intial partial known sequence
  let sequences = [[low_key]];

  //#Moves loop
  //keys to go (number of moves not keys since the start key is already provided [number of keys - 1])
  for (let s = 1; s < number_of_keys; ++s) {
    //variable is used to store new sequences after adding the next keys in a MOVE iterations, if any
    let moves = [];
    
    //#Move loop
    //start with current partial sequences
    sequences.forEach(function(sequence){
      //add one more move to all partial sequences
      const next_move = sequence_next_moves(sequence);
      if(next_move){
        moves = [].concat(moves,next_move);
      }
    });
    
    if(moves.length){
      //store updated sequences
      sequences = moves;
    }else{
      // exit the loop (don't build next moves in a sequence) if no next moves are found in the iteration (this move)
      return 0;
    }
    
  }
  
  //return count after all key sequences are defined for the number_of_keys requested
  return sequences.length;
}






//FIRE
console.log(count_all_sequences("a"));




