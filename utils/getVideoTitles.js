// This script is the main script used to pull video titles down from the API.
require('dotenv').config()
const axios = require('axios')
const fs = require('fs')
const API_KEY = process.env.YT_API_KEY
const PLAYLIST_ID = 'UUXuqSBlHAE6Xw-yeJA0Tunw' // playlist of all LTT videos
const FILE_NAME = './allTitles.txt'

const API_URL = (key, id) => `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${id}&key=${key}&part=snippet&maxResults=50`

axios.get(API_URL(API_KEY, PLAYLIST_ID))
  .then(res => res.data)
  .then(data => appendToFile(data))
  .catch(error => {
    console.log(error.response.data)
  })

function getNextPage (pageToken) {
  axios.get(API_URL(API_KEY, PLAYLIST_ID) + '&pageToken=' + pageToken)
    .then(res => res.data)
    .then(data => appendToFile(data))
    .catch(error => {
      console.log(error.response.data)
    })
};

function appendToFile (data) {
  data.items.forEach(el => {
    fs.appendFile(FILE_NAME, el.snippet.title + '\n', err => {
      if (err) throw err
    })
  })
  getNextPage(data.nextPageToken)
}
