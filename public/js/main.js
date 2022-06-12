

const deleThread = document.querySelectorAll('.fa-trash')
const thumbText = document.querySelectorAll('.fa-thumbs-up')
const threads = document.querySelectorAll(".threadName")
// adds deletion event listeners for threads
Array.from(deleThread).forEach((element)=>{
    element.addEventListener('click', deleteThread)
})
// adds upvote event listeners for threads
Array.from(thumbText).forEach((element)=>{
    element.addEventListener('click', addLike)
})


//*handles fetch for deletion of threads from client to server and database (mongo)
async function deleteThread(){
    //*selects thread name text directly from dom
    const thName = this.parentNode.childNodes[1].innerText
    const prompt = this.parentNode.childNodes[3].innerText
    // handles attempt of delete request to backend
    try{
        //sends request to server to delete thread
        const response = await fetch('deleteThread', {
            // method of request
            method: 'delete',
            // headers of request, lets backend know how to treat it
            headers: {'Content-Type': 'application/json'},
            // body of request
            body: JSON.stringify({
              'threadNameS': thName,
              'promptS': prompt
            })
          })
        //stores response from server in data
        const data = await response.json()
        console.log(data)
        // reloads current page
        location.reload()

    }
    // if there is an issue with the try portion then catch will fire and console log the error
    catch(err){
        console.log(err)
    }
}
//*handles sending request to add like to a thread
async function addLike(){
    //*pulls variables directly from DOM
    const thName = this.parentNode.childNodes[1].innerText
    const prompt = this.parentNode.childNodes[3].innerText
    const tLikes = Number(this.parentNode.childNodes[5].innerText)
    // handles attempt of update request to backend
    try{
        //sends request to server to update thread
        const response = await fetch('addOneLike', {
            // method of request
            method: 'put',
            // headers of request, lets backend know how to treat it
            headers: {'Content-Type': 'application/json'},
            // body of request
            body: JSON.stringify({
              'threadNameS': thName,
              'promptS': prompt,
              'likesS': tLikes
            })
          })
        //stores response from server in data
        const data = await response.json()
        console.log(data)
        // reloads current page
        location.reload()

    }
    // if there is an issue with the try portion then catch will fire and console log the error
    catch(err){
        console.log(err)
    }
}
