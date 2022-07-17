
const deleThread = document.querySelectorAll('.post-delete')
const thumbText = document.querySelectorAll('.post-like')
const thumbDownText = document.querySelectorAll('.post-dislike')
const getLocationBtn = document.querySelector('#getLocation')

const newThreadBtn = document.querySelector('#newThreadSubmit')

newThreadBtn.addEventListener('click',createThread)
getLocationBtn.addEventListener('click',getLocation)

const threads = document.querySelectorAll('.topic')
// adds deletion event listeners for threads
Array.from(deleThread).forEach((element) => {
  element.addEventListener('click', deleteThread)
})
// adds upvote event listeners for threads
Array.from(thumbText).forEach((element) => {
  element.addEventListener('click', addLike)
})
// adds downvote event listeners for threads
Array.from(thumbDownText).forEach((element) => {
  element.addEventListener('click',addDisLike)
})

async function createThread(){
  try{
    const formElement = document.querySelector('#newThreadForm')
    const formData = new FormData(formElement)
    if(localStorage.getItem('userLocation')){
      let locations = localStorage.getItem('userLocation')
      formData.append('location',locations)
    }
    await fetch('/home/addThread',{
      method:'POST',
      body:formData
    })
    location.assign(document.location.origin + document.location.pathname)
  }catch(err){
    console.log(err)
  }
}

//*handles fetch for deletion of threads from client to server and database (mongo)
async function deleteThread(evt){
  //*selects thread name text directly from dom
  const id = evt.target.parentNode.parentNode.previousElementSibling.children[0].children[0].innerText
  const topic = evt.target.parentNode.parentNode.previousElementSibling.children[0].children[1].innerText
  const postedBy = evt.target.parentNode.parentNode.previousElementSibling.children[1].children[0].innerText
  // handles attempt of delete request to backend
  console.log(id,topic,postedBy)
  try{
    //sends request to server to delete thread
    const response = await fetch('/home', {
      // method of request
      method: 'delete',
      // headers of request, lets backend know how to treat it
      headers: { 'Content-Type': 'application/json' },
      // body of request
      body: JSON.stringify({
        'id':id,
        'topic': topic,
        'postedBy': postedBy,
      })
    })
    //stores response from server in data
    const data = await response
    // reloads current page
    location.reload()
  }
  // if there is an issue with the try portion then catch will fire and console log the error
  catch(err){
    console.log(err)
  }
}
//*handles sending request to add like to a thread
async function addLike(evt){
  //*pulls variables directly from DOM
  const thID = evt.target.parentNode.parentNode.previousElementSibling.children[0].children[0].innerText
  const topic = evt.target.parentNode.parentNode.previousElementSibling.children[0].children[1].innerText
  // handles attempt of update request to backend
  try{
    //sends request to server to update thread
    const response = await fetch('/home/addOneLike', {
      // method of request
      method: 'put',
      // headers of request, lets backend know how to treat it
      headers: { 'Content-Type': 'application/json' },
      // body of request
      body: JSON.stringify({
        'threadID': thID,
        'promptS': topic,
      })
    })
    //stores response from server in data
    const data = await response
    console.log(data)
    // reloads current page
    location.reload()

  }
  // if there is an issue with the try portion then catch will fire and console log the error
  catch(err){
    console.log(err)
  }
}

async function addDisLike(evt){
  //*pulls variables directly from DOM
  // const thName = this.parentNode.childNodes[1].innerText
  const thID = evt.target.parentNode.parentNode.previousElementSibling.children[0].children[0].innerText
  const topic = evt.target.parentNode.parentNode.previousElementSibling.children[0].children[1].innerText
  // const tLikes = Number(this.parentNode.childNodes[5].innerText)
  // handles attempt of update request to backend
  try{
    //sends request to server to update thread
    const response = await fetch('/home/addOneDisLike', {
      // method of request
      method: 'put',
      // headers of request, lets backend know how to treat it
      headers: { 'Content-Type': 'application/json' },
      // body of request
      body: JSON.stringify({
        'threadID': thID,
        'promptS': topic,
      })
    })
    //stores response from server in data
    const data = await response
    console.log(data)
    // reloads current page
    location.reload()

  }
  // if there is an issue with the try portion then catch will fire and console log the error
  catch(err){
    console.log(err)
  }
}

//--------------leaflet maps-----------

function paintMap(latitude,longitude,accuracy){
  // Add details to page
  gnssDiv.innerHTML = `Lat/Long: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} 
        <br>Accuracy: ${accuracy} (m)`
  const radius = accuracy / 2
  layerGpsGroup.clearLayers()
  // Zoom to the location
  map.setView([latitude,longitude], 12)
  //Add a marker and radius based on accuracy to map
  L.marker([latitude,longitude]).addTo(layerGpsGroup)
    .bindPopup(`Lat/Long : ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`)
    .openPopup()
  L.circle([latitude,longitude], radius).addTo(layerGpsGroup)
}



// Setup Geolocation API options
const gpsOptions = { enableHighAccuracy: true, timeout: 6000, maximumAge: 600000 }
const gnssDiv = document.getElementById('gnssData')
// Geolocation: Success
async function gpsSuccess(pos) {
  // Get the lat, long, accuracy from Geolocation return (pos.coords)
  const { latitude, longitude, accuracy } = pos.coords
  paintMap(latitude,longitude,accuracy)
  localStorage.setItem('userLocation',[latitude.toFixed(5), longitude.toFixed(5)])
  document.cookie = `location=${[latitude.toFixed(5), longitude.toFixed(5), accuracy]};path=/;samesite=lax;`
  location.reload()
}
// Geolocation: Error
function gpsError(err) {
  console.warn(`Error: ${err.code}, ${err.message}`)
}
// Button onClick, get the the location
async function getLocation() {
  navigator.geolocation.getCurrentPosition(gpsSuccess, gpsError, gpsOptions)
}
// Setup the leaflet map
const map = L.map('map').setView([36.158086, -86.776126], 9) // Nashville area set as default
const osmTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)
const layerGpsGroup = L.layerGroup().addTo(map)



if(document.cookie){
  let lat = Number(document.cookie.split(',')[0].replace('location=',''))
  let long = Number(document.cookie.split(',')[1])
  let accuracy = Number(document.cookie.split(',')[2])
  paintMap(lat,long,accuracy)
}
