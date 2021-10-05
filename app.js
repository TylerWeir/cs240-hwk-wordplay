const ALPHABET_SIZE = 26;
const WORD_SIZE = 6;
var timeleft = 0;

/*
 * Returns a node to be used in a trie.
 */
var trieNode = function() {
    this.children = new Array(ALPHABET_SIZE);
	this.alreadyGuessed = false;
    this.isEndOfWord = false;
}

/*
 * Adds a node to the trie rooted on rootNode.
 */
function addWord(rootNode, word) {
    var currentNode = rootNode;

    for (i = 0; i < word.length; i++) {
        // 97 is the integer value of a
        var index = word.charCodeAt(i) - 97;
        //console.log(index);
        if(currentNode.children[index] == null) {
            // Make a node
            //console.log("making a new node");
            //console.log(String.fromCharCode(97+index));
            currentNode.children[index] = new trieNode();
            currentNode = currentNode.children[index];
        } else {
            // The node already exists
            // Travel down
            currentNode = currentNode.children[index];
        }
    }
    //console.log("ADDED THE WORD");
    currentNode.isEndOfWord = true;
}

/*
 * Searches the trie rooted on 'rootNode' for 'word'. Returns true if the word 
 * is present, false otherwise.
 */
function search(rootNode, word) {
    var currentNode = rootNode;

    for (i = 0; i < word.length; i++) {
        var index = word.charCodeAt(i) - 97;
        
        if(currentNode.children[index] == null) {
            return false;
        } else {
            currentNode = currentNode.children[index];
        }
    }
    return currentNode.isEndOfWord;
}

/*
 * Returns a random word of specified 'length' from the trie rooted on 'rootNode'.
 *
 * TODO: This function is in desperate need of optimization! This is a clumbsy 
 *	     solution to finding a random word. 
 *
 * This may be helpful: https://stackoverflow.com/questions/17152269/how-to-retrieve-a-random-word-of-a-given-length-from-a-trie
 */ 
function getRandomWord(rootNode, length) {
    var word;
    do {
        var letterCode;
        var letter;
        word = "";

        for(k = 0; k < length; k++){
            letterCode = Math.floor(Math.random()*ALPHABET_SIZE + 97);
            letter = String.fromCharCode(letterCode);
            word = word.concat(letter);
        }
    } while (!search(rootNode, word));
    
    return word;
}

/*
 * Takes in a string 'word' and makes the powerset of the characters.
 *
 *
 * This concept came from https://www.geeksforgeeks.org/power-set/
 *
 * It works by matching each index of the word to a bit.  Then a counter runs 
 * from the smallest number (000000) to the largest number (111111), each element of 
 * the subset is made from letters corresponding to bits that are 1 for the number in the
 * counter. 
 *
 * This seems like a very common way to generate powersets. 
 */
function makePowerSet(word){
	var powerSetSize = Math.pow(2, word.length);
	var counter, j;
	var subset = [];
	var powerSet = []

	for (counter = 0; counter <= powerSetSize; counter++) {
		for (j = 0; j < word.length; j++) {
			if ((counter & (1 << j)) > 0){
				subset.push(word[j]);
			}
		}
		powerSet.push(subset);	
		subset = [];
	}

	return powerSet;
}

/*
 * This function uses Heap's algorithm to generate permutations of a set of characters.
 * It pushes each permutation onto the 'output' array. 
 *
 * **NOTE** 
 * Letters must be a list of chars, NOT A STRING.
 *
 */
function generatePermutations(index, letters, output) {
	if(index == 0) {
		return;
	}
	if (index == 1) {
		output.push(letters.join(''));
	} else {
		generatePermutations(index-1, letters, output);
		var i=0;
		for (i = 0; i < index - 1; i++) {
			if (index%2==0) {
				swapChars(letters, i, index-1);
			} else {
				swapChars(letters, 0, index-1);
			}
			generatePermutations(index-1, letters, output);
		}
	}
}

/*
 * Swaps the characters at 'index1' and 'index2' of the given word.
 */
function swapChars(word, index1, index2) {
	var temp = word[index1];
	word[index1] = word[index2]
	word[index2] = temp;
}


/*
 * Shuffles the given word and returns the result. 
 *
 */
function shuffleWord(word) {
	var target;
	var chars = word.split('');
	for (let i = 0; i < chars.length; i++) {
		target = Math.floor(Math.random() * chars.length);
		swapChars(chars, i, target); 
	}
	return chars.join('');
}

/*
 * Formats the letterset to print nicely. 
 */
function formatLetterSet(letters) {
	// turn to 
	var letterList = letters.split('');
	return letterList.join(' ');
}

/*
 * Prints the guessed words.
 */
function printGuesses(guesses) {
	for (let i = 0; i < guesses.length; i++) {
		console.log(guesses[i]);
	}
}

/*
 * Processes the user's guess by replacing the 'dashes' with the actual word
 * if it is contianed in valid words.
 */
function processGuess(guess, guesses, validWords) {
	var index = validWords.indexOf(guess);
	if (index != -1) {
		guesses[index] = validWords[index];
	}
}

/*
 * Checks to see if there are any words the player hasn't yet guessed. 
 * Returns true if the play has won the game (i.e. the player guessed all the words.)
 *
 */
function checkWinCondition(guesses) {
	return guesses.every(element => !element.includes("-"));
}

function printResult(guesses, validWords){
	console.clear();
	console.log("Thanks for playing!");
	var numRight = 0;
	for(let i = 0; i < guesses.length; i++) {
		if(!guesses[i].includes("-")) {
			numRight += 1;
		}
	}
	console.log("You guessed " + numRight + " of the " + validWords.length + " words.");
	console.log("The words were: ");
	validWords.map(word => console.log(word));
}

/*
 * 
 * Game setup.
 *
 */

// Load the dictionary into a trie
var trie = new trieNode();

for (j = 0; j < dictionary.length; j++) {
    addWord(trie, dictionary[j]);
}

// Grab a random word from the trie
const gameWord = getRandomWord(trie, WORD_SIZE);
console.log("The word is " + gameWord);

// Make the powerset of the word and filter by length
var powerset = makePowerSet(gameWord);
powerset = powerset.filter(element => element.length > 2);

// Make the permutations of the powerset elements
var permutations = [];
for(let i = 0; i < powerset.length; i++){
	generatePermutations(powerset[i].length, powerset[i], permutations);
}

// Check each permutation against the dictionary trie to see if it is a valid word.
var validWords = [];
for(let i = 0; i < permutations.length; i++) {
	if(search(trie, permutations[i])){
		if(!validWords.includes(permutations[i])) {
			validWords.push(permutations[i]);
		}
	}
}
validWords.sort(function(a, b) {
	return a.length - b.length;
})


var guesses = validWords.map(word => "-".repeat(word.length));

var letterset = shuffleWord(gameWord)






/*
 *
 * Main game loop
 *
 *
 */

var running = true;
var shuffled = false;

while (running) {
	console.clear();

	// Print the game state
	if(shuffled) {
		console.log("Shuffled the letters.")
		shuffled = false;
	}

	console.log("Letters: " + formatLetterSet(letterset));
	console.log();
	printGuesses(guesses);

	// Get and process the guess from the user
	let guess = prompt("Make a guess! enter '*' to shuffle, 'q' to quit.");

	if (guess == "*") {
		// shuffle the letterset
		letterset = shuffleWord(gameWord);
		shuffled = true;
	} else if (guess == "q" || guess == null) {
		// user wants to quit.
		printResult(guesses, validWords);
		running = false;
	}

	processGuess(guess, guesses, validWords);
	if(checkWinCondition(guesses)) {
		running = false;
		console.clear();
		console.log("You win!!");
	}
}

