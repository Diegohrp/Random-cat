const API_URL = 'https://api.thecatapi.com/v1';
const API_KEY = '8e8102ba-0166-4e10-86b5-749e17bf7f5d';
//?limit=4&page=100&api_key=8e8102ba-0166-4e10-86b5-749e17bf7f5d

async function getRandomCats() {
  const response = await fetch(`${API_URL}/images/search?limit=4&page=100`);
  const data = await response.json();
  const img = document.getElementsByTagName('img');
  const txt = document.getElementsByTagName('span');
  const button = document.getElementsByTagName('button');

  data.map((item) => {
    img[data.indexOf(item)].src = item.url;
    txt[data.indexOf(item)].innerText = item.id;
    button[data.indexOf(item)].id = item.id;
  });
}

async function getFavoriteCats() {
  const response = await fetch(`${API_URL}/favourites`, {
    method: 'GET',
    headers: {
      'X-API-KEY': API_KEY,
    },
  });
  const data = await response.json();

  if (response.status !== 200) {
    const spanError = document.querySelector('#error');
    spanError.innerText =
      'Unexpected error ' + response.status + ': ' + data.message;
  } else {
    const section = document.getElementById('favorite-cats');
    section.innerHTML = '';
    const favorites = data.map((item) => {
      const article = document.createElement('article');
      const img = document.createElement('img');
      const div = document.createElement('div');
      const span = document.createElement('span');
      const button = document.createElement('button');

      //Asignamos la url a la imagen
      img.src = item.image.url;
      //Asignamos el icono al botón
      button.innerHTML = `<i class="fa-solid fa-circle-minus"></i>`;
      button.onclick = () => deleteFromFav(item.id);
      //Asignamos el texto al span
      span.innerText = item.image.id;
      //Creamos los nodos
      div.append(span, button);
      article.append(img, div);
      return article;
    });
    section.append(...favorites);
    //console.log(data);
  }
}

async function addFavorite(id) {
  const response = await fetch(`${API_URL}/favourites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY,
    },
    body: JSON.stringify({
      image_id: id,
    }),
  });
  const data = await response.json();
  if (response.status !== 200) {
    const spanError = document.querySelector('#error');
    spanError.innerText =
      'Unexpected error ' + response.status + ': ' + data.message;
  } else {
    console.log(data);
    getFavoriteCats();
  }
}

async function deleteFromFav(id) {
  const response = await fetch(`${API_URL}/favourites/${id}`, {
    method: 'DELETE',
    headers: {
      'X-API-KEY': API_KEY,
    },
  });
  const data = await response.json();

  if (response.status !== 200) {
    const spanError = document.querySelector('#error');
    spanError.innerText =
      'Unexpected error ' + response.status + ': ' + data.message;
  } else {
    getFavoriteCats();
  }
  console.log(data);
}

function previewImage() {
  const preview = document.getElementById('preview');
  //Es un objeto con los atributos 0 y lenght
  const file = document.getElementById('file').files;

  if (file.length > 0) {
    console.log(file);
    const fileReader = new FileReader();
    fileReader.onload = (e) => (preview.src = e.target.result);
    //Obtenemos el atributo con nombre 0 del objeto file
    fileReader.readAsDataURL(file[0]);
    preview.style.visibility = 'visible';
  }
}

async function uploadPhoto() {
  const form = document.getElementById('formPhoto');
  const formData = new FormData(form);
  const preview = document.getElementById('preview');
  preview.style.visibility = 'hidden';

  const request = await fetch(`${API_URL}/images/upload`, {
    method: 'POST',
    headers: {
      'X-API-KEY': API_KEY,
    },
    body: formData,
  });
  if (request.status !== 201) {
    const spanError = document.querySelector('#error');
    spanError.innerText = 'Unexpected error: Upload a valid image';
  } else {
    const data = await request.json();
    //console.log(request.status);
    //console.log(data);
    addFavorite(data.id);
  }
}

getRandomCats();
getFavoriteCats();
