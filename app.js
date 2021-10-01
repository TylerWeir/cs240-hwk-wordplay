const ALPHABET_SIZE = 26;

// Constructor to make trie nodes 
var trieNode = function() {
    this.children = new Array(ALPHABET_SIZE);
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
function makePowerSet(word){
	const powerSetSize = Math.pow(2, word.length);

	for (i = 0; i <= powerSetSize; i++) {

	}
}
			

// This function uses Heap's algorithm to generate permutations of a set of characters.
// it pushes each permutation onto the 'output' array.
// **NOTE** letters must be a list of chars, NOT A STRING
function generatePermutations(index, letters, output) {
	if (index == 1) {
		output.push(letters);
	} else {
		generatePermutations(index-1, letters);
		var i=0;
		for (i = 0; i < index - 1; i++) {
			if (index%2==0) {
				// Swap A[j] and A[index-1]
				var temp = letters[i];
				letters[i]=letters[index-1];
				letters[index-1] = temp;
			} else {
				//swap A[0], and A[index-1]
				var temp = letters[0];
				letters[0] = letters[index-1]
				letters[index-1] = temp;
			}
			generatePermutations(index-1, letters);
		}
	}
}

function swapChars(string, index1, index2) {
	char1 = string.charAt(index1);
	char2 = string.charAt(index2);

	subString1 = string.slice(0, index1),
	subString2 = string.slice(index1+1, index2);
	subString3 = string.slice(index2, string.length);
	if(index2 == string.length-1) {
		subString3 = "";
	}

	return "" + subString1 + char2 + subString2 + char1 + subString3;
}

var trie = new trieNode();

for (j = 0; j < dictionary.length; j++) {
    addWord(trie, dictionary[j]);
}
   
console.log("done");
   
