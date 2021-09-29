const ALPHABET_SIZE = 26;

// Nodes for the trie data structure
var trie_node = function() {
    this.children = [null, null, null];
    this.isEndOfWord = false;
}

// Insert a new word into the trie.
function add_word(root_node, word) {
    var currentNode = root_node;

    for (i = 0; i < word.length; i++) {
        var index = word[i] - 'a';
        
        if(currentNode.children[index] == null) {
            // Make a node
            console.log("making a new node");
            currentNode.children[index] = new trie_node();
            currentNode = currentNode.children[index];
        } else {
            // The node already exists
            // Travel down
            currentNode = currentNode.children[index];
            
        }
    }
    currentNode.isEndOfWord = true;
}


var trie = new trie_node();
add_word(trie, "cat");