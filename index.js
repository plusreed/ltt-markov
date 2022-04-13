const fs = require('fs')
const path = require('path')
const Twit = require('twit')

if (process.env.NODE_ENV === 'development') {
  console.log('NODE_ENV=development, dotenv is being configured...')
  require('dotenv').config()
}

const t = new Twit({
  consumer_key: process.env.T_CONSUMER_KEY,
  consumer_secret: process.env.T_CONSUMER_SECRET,
  access_token: process.env.T_ACCESS_TOKEN,
  access_token_secret: process.env.T_ACCESS_SECRET
})

const Markov = require('markov-strings').default

let corpus = []
fs.readdirSync(path.join(__dirname, '/titles/prod')).forEach(file => {
  const data = fs.readFileSync(path.join(__dirname, '/titles/prod/', file))
  corpus.push(data.toString().split('\n'))
})

corpus = corpus.flat()
makeTweet()

function generateMarkovString (markov) {
  return markov.generate(require('./config/markov/genConfig'))
}

function makeTweet () {
  console.log('init markov')
  const markov = new Markov(corpus, require('./config/markov/constructorConfig'))
  console.log('build corpus')
  markov.buildCorpus()

  console.log('string is being generated..')
  const result = generateMarkovString(markov)

  console.log('result generated, score is:', result.score)
  console.log('result:', result.string)

  if (result.score <= 100) {
    console.log('score was less than 5, regenerating...')
    return makeTweet()
  } else {
    console.log('tweeting...')
    t.post('statuses/update', { status: result.string }, (err, _, __) => {
      if (err) throw err
    })
  }
}
