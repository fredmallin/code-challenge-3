const baseUrl = 'http://localhost:3000/posts';

document.addEventListener('DOMContentLoaded', main);

function main() {
  addNewPostListener();
  displayPosts();
}

function displayPosts() {
  fetch(baseUrl)
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById('post-list');
      postList.innerHTML = '';

      posts.forEach(post => {
        const div = document.createElement('div');
        div.textContent = post.title;
        postList.appendChild(div);
      });
    });
}

function addNewPostListener() {
  const form = document.getElementById('new-post-form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const newPost = {
      title: document.getElementById('new-title').value,
      content: document.getElementById('new-content').value,
      author: document.getElementById('new-author').value
    };

    fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(() => {
        form.reset();     
        displayPosts();   
      });
  });
}