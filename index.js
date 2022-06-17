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
  const response = await fetch(
    `${API_URL}/favourites?limit=8&api_key=${API_KEY}`
  );
  const data = await response.json();

  if (response.status !== 200) {
    const spanError = document.querySelector('#error');
    spanError.innerText =
      'Ha ocurrido un error ' + response.status + ': ' + data.message;
  } else {
    const section = document.getElementById('favorite-cats');
    //section.innerHTML = '';
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
      //Asignamos el texto al span
      span.innerText = item.image.id;
      //Creamos los nodos
      div.append(span, button);
      article.append(img, div);
      return article;
    });
    section.append(...favorites);
  }
}

async function addFavorite(id) {
  const response = await fetch(`${API_URL}/favourites?api_key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_id: id,
    }),
  });
  const data = await response.json();
  if (response.status !== 200) {
    const spanError = document.querySelector('#error');
    spanError.innerText =
      'Ha ocurrido un error ' + response.status + ': ' + data.message;
  } else {
    console.log(data);
    getFavoriteCats();
  }
}

getRandomCats();
getFavoriteCats();
