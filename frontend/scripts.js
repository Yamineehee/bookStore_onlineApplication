// scripts.js

// Handle Signup Form Submission
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  try {
    const response = await fetch('http://localhost:8000/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, role }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('User registered successfully');
      window.location.href = 'login.html';  // Redirect to login page on successful registration
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while registering the user.');
  }
});

// Handle Login Form Submission
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  console.log('Login form submitted with:', { username, password });

  try {
    const response = await fetch('http://localhost:8000/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log('Response from server:', data);

    if (response.ok) {
      localStorage.setItem('token', data.token);

      // Decode the JWT to get the role
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const role = payload.role;

      console.log('User role:', role);

      if (role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'books.html';
      }
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while logging in.');
  }
});

// // Fetch and Display Books
// async function fetchBooks() {
//   try {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       throw new Error('User is not authenticated');
//     }

//     const response = await fetch('http://localhost:8000/book', {
//       headers: {
//         'Authorization': token
//       }
//     });
    
//     const books = await response.json();

//     if (!Array.isArray(books)) {
//       throw new Error('Response is not an array');
//     }

//     const booksList = document.getElementById('booksList');
//     booksList.innerHTML = '';

//     books.forEach((book) => {
//       const bookItem = document.createElement('div');
//       bookItem.classList.add('book-item');
//       bookItem.innerHTML = `
//         <img src="${book.image}" alt="${book.name}" class="book-image">
//         <h3>${book.name}</h3>
//         <p>${book.author}</p>
//         <p>${book.genre}</p>
//         <p>${book.description}</p>
//         <button class="order-button" data-book-id="${book.id}">Order</button>
//       `;
//       booksList.appendChild(bookItem);
//     });
//   } catch (error) {
//     console.error('Error fetching books:', error);
//   }
// }

// Fetch and Display Books
async function fetchBooks() {
  console.log('Fetching books...'); // Debugging line
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    const response = await fetch('http://localhost:8000/book', {
      headers: {
        'Authorization': token
      }
    });
    
    const books = await response.json();

    if (!Array.isArray(books)) {
      throw new Error('Response is not an array');
    }

    const booksList = document.getElementById('booksList');
    booksList.innerHTML = ''; // Clear the existing list

    books.forEach((book) => {
      const bookItem = document.createElement('div');
      bookItem.classList.add('book-item');
      bookItem.innerHTML = `
        <img src="${book.image}" alt="${book.name}" class="book-image">
        <h3>${book.name}</h3>
        <p>${book.author}</p>
        <p>${book.genre}</p>
        <p>${book.description}</p>
        <button class="order-button" data-book-id="${book.id}">Order</button>
      `;
      booksList.appendChild(bookItem);
    });
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}

// Check if on Books Page
if (window.location.pathname.endsWith('books.html')) {
  document.addEventListener('DOMContentLoaded', fetchBooks);
}



// Handle Add Book Form Submission (For Admins)
document.getElementById('addBookForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const bookName = document.getElementById('bookName').value;
  const bookAuthor = document.getElementById('bookAuthor').value;
  const bookGenre = document.getElementById('bookGenre').value;
  const bookDescription = document.getElementById('bookDescription').value;
  const bookImage = document.getElementById('bookImage').files[0];

  const formData = new FormData();
  formData.append('name', bookName);
  formData.append('author', bookAuthor);
  formData.append('genre', bookGenre);
  formData.append('description', bookDescription);
  formData.append('image', bookImage);

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/book', {
      method: 'POST',
      headers: {
        'Authorization': token,
      },
      body: formData,
    });

    const data = await response.json();
    console.log('Response from server:', data);

    if (response.ok) {
      alert('Book added successfully');
      window.location.reload();
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while adding the book.');
  }
});
