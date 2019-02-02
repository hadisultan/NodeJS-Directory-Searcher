# NodeJS-Directory-Searcher
A program that will search a directory for underlying directories and files to create and index for these files and search them for corresponding words.

"node searcher.js index myIndex.JSON MyDirectory" will open up a directory
called 'MyDirectory' and scan for a the files and folders inside. Then 
it'll create an index JSON file called 'myIndex.JSON' where it will index 
all words according to the line and filepath. Each word may have multiple
lines/filepaths. 

"node searcher.js search myIndex.JSON [song hair sleep]" will open and 
parse the file named 'myIndex.JSON' search for "song", "hair" and "sleep"
and will output the lines containing any of these words.
