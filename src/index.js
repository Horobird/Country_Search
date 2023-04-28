import './css/styles.css';
const Swal = require('sweetalert2'); //Подключаем библеотеку вспл. окон
const textInput = document.querySelector('#search-box'); // DOM element for input
let debounce = require('lodash.debounce'); //Подключаем библеотеку задержки
let contextUl = document.querySelector('.country-list'); // DOM element for ul
const DEBOUNCE_DELAY = 300;
const audioCtx = new (window.AudioContext || //звучок на alert
  window.webkitAudioContext ||
  window.audioContext)();
function beep(duration, frequency, volume, type, callback) {
  var oscillator = audioCtx.createOscillator();
  var gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  if (volume) {
    gainNode.gain.value = volume;
  }
  if (frequency) {
    oscillator.frequency.value = frequency;
  }
  if (type) {
    oscillator.type = type;
  }
  if (callback) {
    oscillator.onended = callback;
  }
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + (duration || 100) / 2000);
}
// For to clean with ESCAPE
document.addEventListener('keydown', e => {
  if (e.code == 'Escape') {
    chowSearch.close();
    chowNotFound.close();
    contextUl.textContent = null;
    textInput.value = null;
  }
});
//Стилизуем alert когда мало букв для поиска
const chowSearch = Swal.mixin({
  background: '#5bd8d1', // изумруд
  color: '#ffffff',
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timerProgressBar: true,
  icon: 'info',
  width: '30%',
  iconColor: '#008080',
  didOpen: toast => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});
//Стилизуем alert когда ниче не найдено
const chowNotFound = Swal.mixin({
  background: '#ff0000',
  color: '#ffffff',
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timerProgressBar: true,
  icon: 'error',
  width: '30%',
  iconColor: '#008080', // красный
  didOpen: toast => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});
const fetchCountries = debounce(cantryName => {
  fetch(
    `https://restcountries.com/v3.1/name/${cantryName}?fields=name,flags,population,capital,languages`
  )
    .then(response => response.json())
    .then(posts => {
      contextUl.textContent = null;
      //Проверяем ошибку 400
      if (posts.status >= 400) {
        beep(350, 150);
        beep(350, 450);
        chowNotFound.fire({
          title: 'Oops, there is no country with that name',
        });
        return;
      }
      //Проверем достаточность знаков в поле input
      if (posts.length > 10) {
        beep(250, 300);
        beep(250, 100);
        chowSearch.fire({
          title: 'Too many matches found. Please enter a more specific name',
        });
        return;
      }
      //Логика для разметки HTML, если найдено стран от2 до 10
      else {
        chowSearch.close();
        chowNotFound.close();
        if (posts.length >= 2) {
          posts = posts.sort();
          //Формируем HTML строку
          let stringSeachResuolt = '';
          for (let post of posts) {
            let stringUl = `<li  style='list-style-type : none;' ><img width='36' height='24' src=
            ${post.flags.svg}> ${post.name.official} </li>`;
            stringSeachResuolt = stringSeachResuolt.concat(stringUl);
          }
          contextUl.insertAdjacentHTML('afterbegin', stringSeachResuolt);
        }
      }
      //Логика для разметки HTML, если найдена 1 страна
      if (posts.length <= 1 && posts.length != 0) {
        let getLanguages;
        let languagesAll = '';
        let gs = Object.keys(posts[0].languages);
        // Извлекаем языки из объекта
        for (let g of gs) {
          getLanguages = posts[0].languages[g];
          languagesAll = languagesAll.concat(getLanguages);
        }
        // Формируем строку разметки
        let stringUl1 = ` <li  style='list-style-type : none;' ><h2><img width='60' height='40' src= "
         ${posts[0].flags.svg}"> ${posts[0].name.official} <h2></li>
         <li  style='padding: 1.5% 0;list-style-type : none;font-size: 20px;' ><span style='font-weight: bold;'>Capital:</span> <span> ${posts[0].capital}</span> </li> 
         <li  style='padding: 1.5% 0;list-style-type : none;font-size: 20px;'><span style='font-weight: bold;'>Population:</span> <span> ${posts[0].population}</span> </li> 
         <li  style='padding: 1.5% 0;list-style-type : none;font-size: 20px;'><span style='font-weight: bold;'>Langvuages:</span> <span> ${languagesAll} </li></span>`;
        contextUl.insertAdjacentHTML('afterbegin', stringUl1);
      }
    })
    .catch(error => console.log(error));
}, DEBOUNCE_DELAY);
//Слухавка для input
textInput.addEventListener('input', event => {
  let cantryName = event.currentTarget.value.trim();
  fetchCountries(cantryName);
});
