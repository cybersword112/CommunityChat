const getLocationBtn = document.querySelector('#getLocation')

if( document.querySelector('#userLoggedName') ){

  const thumbText = document.querySelectorAll('.post-like')
  const thumbDownText = document.querySelectorAll('.post-dislike')
  const newThreadBtn = document.querySelector('#newThreadSubmit')
  const deleThread = document.querySelectorAll('.post-delete')

  newThreadBtn.addEventListener('click',createThread)

  // const threads = document.querySelectorAll('.topic')
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

}


getLocationBtn.addEventListener('click',getLocation)


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
    console.log('right before reload')
    document.getElementById('map').scrollIntoView()
    setTimeout(() => {
      location.reload(true)
    },750)
  }catch(err){
    console.log(err)
  }
}

//*handles fetch for deletion of threads from client to server and database (mongo)
async function deleteThread(evt){
  //*selects thread name text directly from dom
  let imageId = null
  const id = evt.target.parentNode.parentNode.previousElementSibling.children[0].children[0].innerText
  const topic = evt.target.parentNode.parentNode.previousElementSibling.children[0].children[1].innerText
  const postedBy = evt.target.parentNode.parentNode.previousElementSibling.children[1].children[0].innerText
  // handles attempt of delete request to backend
  imageId = evt.target.parentNode.parentNode.parentNode.children[0].children[0].getAttribute('value') || null
  try{
    //sends request to server to delete thread
    const response = await fetch('/home', {
      // method of request
      method: 'delete',
      // headers of request, lets backend know how to treat it
      headers: { 'Content-Type': 'application/json'},
      // body of request
      body: JSON.stringify({
        'id':id,
        'imageId':imageId,
        'topic': topic,
        'postedBy': postedBy,
      })
    })
    //stores response from server in data
    const data = response
    // reloads current page
    setTimeout(() => {
      location.reload(true)
    },750)
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
  latitude = Number(latitude)
  longitude = Number(longitude)
  accuracy = Number(accuracy)
  const latlngObj = L.latLng([latitude,longitude])
  // Add details to page
  gnssDiv.innerHTML = `Lat/Long: ${latitude}, ${longitude} 
        <br>Accuracy: ${accuracy} (m)`
  const radius = accuracy / 2
  layerGpsGroup.clearLayers()
  // Zoom to the location
  map.setView(latlngObj, 12)
  //Add a marker and radius based on accuracy to map
  L.marker([latitude,longitude]).addTo(layerGpsGroup)
    .bindPopup(`Lat/Long : ${latitude}, ${longitude}`)
    .openPopup()
  L.circle([latitude,longitude], radius).addTo(layerGpsGroup)
}



// Setup Geolocation API options
const gpsOptions = { enableHighAccuracy: true, timeout: 6000, maximumAge: 600000 }
const gnssDiv = document.getElementById('gnssData')
// Geolocation: Success
async function gpsSuccess(pos) {
  // Get the lat, long, accuracy from Geolocation return (pos.coords)
  let { latitude, longitude, accuracy } = pos.coords
  latitude = latitude.toFixed(5)
  longitude = longitude.toFixed(5)
  paintMap(latitude,longitude,accuracy)
  localStorage.setItem('userLocation',[latitude, longitude])
  document.cookie = `location=${[latitude, longitude,accuracy]};path=/;samesite=lax;`
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


if(document.cookie.includes('location')){
  let index = document.cookie.split(';').findIndex((item) => item.includes('location='))
  let location = document.cookie.split(';')[index]
  let lat = location.split(',')[0].replace('location=','')
  let long = location.split(',')[1]
  let accuracy = location.split(',')[2]
  paintMap(lat,long,accuracy)
}
