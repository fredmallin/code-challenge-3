
document.addEventListener("DOMContentLoaded", main);

let currentPostId = null;

function main() {
  displayPosts();
  addNewPostListener();
  addEditPostListener();
  addDeleteDetailListener();
  addCancelEditListener();
}

function displayPosts() {
  fetch("http://localhost:3000/posts")
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById("post-list");
      postList.innerHTML = "";
      posts.forEach(post => {
        const div = document.createElement("div");
        div.classList.add("post-item");

        div.innerHTML = `
          <strong>${post.title}</strong><br>
          ${post.image ? `<img src="${post.image}" style="max-width: 100px;">` : ""}
          <br>
          <button data-id="${post.id}" class="delete-post-btn">Delete</button>
        `;

        div.addEventListener("click", (e) => {
          if (!e.target.classList.contains("delete-post-btn")) {
            handlePostClick(post.id);
          }
        });

        const deleteBtn = div.querySelector(".delete-post-btn");
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          fetch(`http://localhost:3000/posts/${post.id}`, {
            method: "DELETE"
          })
            .then(() => {
              displayPosts();
              if (currentPostId === post.id) {
                clearDetailView();
                currentPostId = null;
              }
            });
        });

        postList.appendChild(div);
      });

      if (posts.length > 0 && currentPostId == null) {
        handlePostClick(posts[0].id);
      }
    });
}

function handlePostClick(id) {
  fetch(`http://localhost:3000/posts/${id}`)
    .then(res => res.json())
    .then(post => {
      currentPostId = post.id;
      document.getElementById("detail-title").textContent = post.title;
      document.getElementById("detail-content").textContent = post.content;
      document.getElementById("detail-author").textContent = `By: ${post.author}`;

      const image = document.getElementById("detail-image");
      if (post.image) {
        image.src = post.image;
        image.alt = post.title;
        image.style.display = "block";
      } else {
        image.style.display = "none";
      }
    });
}

function clearDetailView() {
  document.getElementById("detail-title").textContent = "";
  document.getElementById("detail-content").textContent = "";
  document.getElementById("detail-author").textContent = "";
  document.getElementById("detail-image").style.display = "none";
}

function addNewPostListener() {
  document.getElementById("new-post-form").addEventListener("submit", e => {
    e.preventDefault();
    const newPost = {
      title: document.getElementById("new-title").value,
      content: document.getElementById("new-content").value,
      author: document.getElementById("new-author").value,
      image: document.getElementById("new-image").value
    };

    fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(() => {
        displayPosts();
        e.target.reset();
      });
  });
}

function addEditPostListener() {
  document.getElementById("edit-btn").addEventListener("click", () => {
    document.getElementById("edit-post-form").classList.remove("hidden");
    document.getElementById("edit-title").value = document.getElementById("detail-title").textContent;
    document.getElementById("edit-content").value = document.getElementById("detail-content").textContent;
  });

  document.getElementById("edit-post-form").addEventListener("submit", e => {
    e.preventDefault();
    const updatedPost = {
      title: document.getElementById("edit-title").value,
      content: document.getElementById("edit-content").value
    };

    fetch(`http://localhost:3000/posts/${currentPostId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost)
    })
      .then(res => res.json())
      .then(post => {
        displayPosts();
        handlePostClick(post.id);
        document.getElementById("edit-post-form").classList.add("hidden");
      });
  });
}

function addDeleteDetailListener() {
  document.getElementById("delete-btn").addEventListener("click", () => {
    if (!currentPostId) return;

    fetch(`http://localhost:3000/posts/${currentPostId}`, {
      method: "DELETE"
    })
      .then(() => {
        displayPosts();
        clearDetailView();
        currentPostId = null;
      });
  });
}

function addCancelEditListener() {
  document.getElementById("cancel-edit").addEventListener("click", () => {
    document.getElementById("edit-post-form").classList.add("hidden");
  });
}
