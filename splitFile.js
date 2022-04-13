const inFileName = 'allTitles.txt'
let fileCount = 1
let count = 0
const fs = require('fs')
var outStream
let outFileName = `titles${fileCount}.txt`
newWriteStream()
const inStream = fs.createReadStream(inFileName)

const lineReader = require('readline').createInterface({
  input: inStream
})

function newWriteStream () {
  outFileName = `titles${fileCount}.txt`
  outStream = fs.createWriteStream(outFileName)
  count = 0
}

lineReader.on('line', line => {
  count++

  outStream.write(line + '\n')
  if (count >= 200) {
    fileCount++
    console.log('file', outFileName, count)
    outStream.end()
    newWriteStream()
  }
})

lineReader.on('close', () => {
  if (count > 0) {
    console.log('Final close:', outFileName, count)
  }
  inStream.close()
  outStream.end()
  console.log('done')
})
