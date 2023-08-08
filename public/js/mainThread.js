const deleteBtns = document.querySelectorAll('.deleteButton')
const likeBtns = document.querySelectorAll('.likeButton')
const dislikeBtns = document.querySelectorAll('.dislikeButton')

Array.from(deleteBtns).forEach((el) => {
  el.addEventListener('click',deleteMessage)
})

Array.from(likeBtns).forEach((el) => {
  el.addEventListener('click',addLike)
})

Array.from(dislikeBtns).forEach((el) => {
  el.addEventListener('click',addDislike)
})

async function deleteMessage(evt){
  const id = evt.target.dataset.id
  console.log(id)
  await fetch('/messages',{
    method:'delete',
    headers:{ 'Content-Type':'application/json' },
    body:JSON.stringify({
      id:id,
    })
  })
  location.reload()
}

async function addLike(evt){
  const id = evt.target.dataset.id
  console.log(id)
  let data = await fetch('/messages/addLike',{
    method:'PUT',
    headers:{ 'Content-Type':'application/json' },
    body:JSON.stringify({
      id:id,
    })
  })
  if(data.status === 200){
    let elem = evt.target.querySelector('.likes-count')
    let num = parseInt(elem.innerText,10)
    elem.innerText = num+1
  }
  // location.reload()
}

async function addDislike(evt){
  const id = evt.target.dataset.id
  let data = await fetch('/messages/addDislike',{
    method:'PUT',
    headers:{ 'Content-Type':'application/json' },
    body:JSON.stringify({
      id:id,
    })
  })
  if(data.status === 200){
    let elem = evt.target.querySelector('.dislikes-count')
    let num = parseInt(elem.innerText,10)
    elem.innerText = num+1
  }
  // location.reload()
}