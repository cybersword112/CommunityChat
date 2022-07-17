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
  await fetch('/messages/addLike',{
    method:'PUT',
    headers:{ 'Content-Type':'application/json' },
    body:JSON.stringify({
      id:id,
    })
  })
  location.reload()
}

async function addDislike(evt){
  const id = evt.target.dataset.id
  await fetch('/messages/addDislike',{
    method:'PUT',
    headers:{ 'Content-Type':'application/json' },
    body:JSON.stringify({
      id:id,
    })
  })
  location.reload()
}