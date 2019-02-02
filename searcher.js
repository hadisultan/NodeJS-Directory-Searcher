const path = require('path')
const fs = require('fs')

let json = {}
let cb = 0
let cbc = 0
let line = 1
let searcharr = []


const splitwords = (sentence, dir, cb1, cb2) => {
	line = 1
	words = sentence
              .replace(/[.,?!;()""-]/g, " ")
              .replace(/\n/g, " /newline ")
              .split(" ")
    words.forEach(function (word) {
    	if(word == "/newline"){
    		line++
    	}
        else if (json[word]==undefined) {
            json[word] = [{"file" : dir, "lines": [line]}];
        }
        else{
        	check = 0
        	json[word].forEach(lst => {
        		if(lst["file"] == dir ) {
        			check++
        			lst["lines"].push(line)
        		}
        	})
        	if(check == 0){
        		json[word].push({"file": dir,"lines": [line]}) 
        	}
        }
    })
    cb1()
    cb2()
}

const fileparser = (direct) => new Promise(resolve => {
		fs.readdir(direct, (err, files) => {
			if (err) {
				console.log(`Reading ${direct} ${err}`)
			}
			else {
				console.log(`Folder with ${files.length} file/s found.`)
				let count = files.length
				files.forEach(file => {
					fs.lstat(path.join(direct, file), (err, stats) => {
						if(stats.isDirectory()){
							console.log(`New subfolder found.`)
							fileparser(path.join(direct, file)).then(()=>{
								--count || resolve()
								console.log(`${path.join(direct, file)} fully scanned.`)
							})
						}
						else{
							cb++
							fs.readFile(path.join(direct, file), 'utf-8', (err, data) => {
								splitwords(data, path.join(direct, file), () => cbc++, () => console.log(`${cbc} of ${cb} files parsed.`))
								--count || resolve()
							})
						}
					})
				})
			}
		})
	})

const addline = (text, line) => {
	words = text
              .split("\n")
    searcharr.push(words[line-1])
}

const getlines = (stringarr) => new Promise(resolve => {
	let text = "" 
	let count = stringarr.length
	for(var i=0; i<stringarr.length; i++)
	{
		let entries = json[stringarr[i]]
		if(entries!=undefined){
			for(var j=0; j<entries.length; j++){
				text = fs.readFileSync(entries[j]["file"], 'utf-8')
				linearr = entries[j]["lines"]
				for(var k = 0; k<linearr.length; k++)
				{
					addline(text, linearr[k])
				}
			}
		}
		--count || resolve()
	}
})


if(process.argv[2] == 'index'){ 
	let p =""
	p = process.argv[4]
	for(var i = 5; i<process.argv.length; i++)
	{
		p += ' ' + process.argv[i]
	}
	fileparser(p).then(() =>{
		console.log('Parsing complete.')
		console.log(`${p} fully scanned.`)
		let sjson = JSON.stringify(json)
		fs.writeFile(process.argv[3], sjson, err => {
			console.log(`${process.argv[3]} written.`)
		})
	})
}
else if(process.argv[2] == 'search'){
	let jon = fs.readFileSync(process.argv[3])
	json = JSON.parse(jon)
	let arg = []
	for(var i=4; i<process.argv.length; i++)
	{
		arg.push(process.argv[i])
	}
	let first = arg[0]
	let firstm = ""
	for(var i=1; i<first.length;i++)
	{
		firstm += (first[i])
	}
	arg[0] = firstm
	let last = arg[arg.length-1]
	let lastm = ""
	for(var i=0; i<last.length-1;i++)
	{
		lastm += (last[i])
	}
	arg[arg.length-1] = lastm
	getlines(arg).then(() => {
		for(var i=0; i<searcharr.length; i++){
			console.log(` ${searcharr[i]} \n`)
		}
	})
}
else{
	console.log("INVALID INPUT")
}	
