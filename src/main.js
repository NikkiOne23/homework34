import './styles/style.css';

const content = document.getElementById('content');
const firstBtn = document.getElementById('prevBtn');
const secondBtn = document.getElementById('nextBtn');

let baseUrl = 'https://swapi.py4e.com/api';
let currentType = 'people';
let currentPageUrl = `${baseUrl}/people/`;
let nextUrl = null;
let prevUrl = null;

document.querySelectorAll('[data-id]').forEach(btn => {
  btn.addEventListener('click', () => {
    currentType = btn.getAttribute('data-id');
    currentPageUrl = `${baseUrl}/${currentType}/`;
    loadData(currentPageUrl);
  });
});

firstBtn.addEventListener('click', () => {
  if (prevUrl) loadData(prevUrl);
});

secondBtn.addEventListener('click', () => {
  if (nextUrl) loadData(nextUrl);
});

async function loadData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    nextUrl = data.next;
    prevUrl = data.previous;

    firstBtn.disabled = !prevUrl;
    secondBtn.disabled = !nextUrl;

    currentPageUrl = url;
    renderList(data.results);
  } catch (error) {
    console.error('Mistake of load', error);
    content.innerHTML = '<div class="mistake">Mistake of load</div>';
  }
}

function renderList(items) {
  content.innerHTML = '';
  items.forEach(item => {
    const id = item.url.match(/\/(\d+)\/$/)[1];
    const card = document.createElement('div');
    card.className = 'column-card-container';
    card.innerHTML = `
      <div class="card-data" data-id="${id}">
        <div class="card-body">
          <h3 class="card-title">${item.name || item.title}</h3>
          <p class="card-text">About</p>
        </div>
      </div>
    `;
    card.querySelector('.card-data').addEventListener('click', () => {
      showDetails(id);
    });
    content.appendChild(card);
  });
}

async function showDetails(id) {
  try {
    const response = await fetch(`${baseUrl}/${currentType}/${id}/`);
    const data = await response.json();

    const card = document.createElement('div');
    card.className = 'column';
    card.innerHTML = `
      <div class="card-p4">
        <h3>${data.name || data.title}</h3>
        <pre class="mt">${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;

    const backBtn = document.createElement('button');
    backBtn.textContent = 'Back to main';
    backBtn.addEventListener('click', () => loadData(currentPageUrl));
    card.querySelector('.card-p4').appendChild(backBtn);

    content.innerHTML = '';
    content.appendChild(card);

    firstBtn.disabled = true;
    secondBtn.disabled = true;
  } catch (error) {
    console.error('Mistake loading parts', error);
    content.innerHTML = '<div class="mistake">Mistake loading parts</div>';
  }
}

loadData(currentPageUrl);
