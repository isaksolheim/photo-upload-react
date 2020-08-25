export function postImage(img) {
  fetch('http://localhost:3001/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: img })
  })
    .then(res => {
      console.log(res.status);
    })
    .catch(error => {
      return error;
    });
}
