const ALPHABET_SIZE = 26;
const WORD_SIZE = 6;

// Constructor to make trie nodes 
var trieNode = function() {
    this.children = new Array(ALPHABET_SIZE);
	this.alreadyGuessed = false;
    this.isEndOfWord = false;
}

// Insert a new word into a given trie.
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

// Searches the specified trie for the specified word. Returns true if the word
// is present, false otherwise. 
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

// Returns a random word of specified length from a specified trie. 
// 
// This function is super slow when the word length surpasses 6!
// This should be optimized. 
//
// This may be helpful: https://stackoverflow.com/questions/17152269/how-to-retrieve-a-random-word-of-a-given-length-from-a-trie
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

// This function takes in a string (set of chars) and makes the powerset of the characters.
// **NOTE** It will return combinations that are not valid words.
// This slick idea came from https://www.geeksforgeeks.org/power-set/
function makePowerSet(word, output){
	var powerSetSize = Math.pow(2, word.length);
	var counter, j;
	var subset = [];

	for (counter = 0; counter <= powerSetSize; counter++) {
		for (j = 0; j < word.length; j++) {
			if ((counter & (1 << j)) > 0){
				subset.push(word[j]);
			}
		}
		output.push(subset);	
		subset = [];
	}
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
const randomWord = getRandomWord(trie, WORD_SIZE);
console.log("The word is " + randomWord);

// Make the powerset of the word
var powerset = [];
makePowerSet(randomWord, powerset);
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



console.log(validWords);
