import './css/styles.css';
const Swal = require('sweetalert2'); //Подключаем библеотеку вспл. окон
//const contentUl = document.querySelector('.country-list');
let debounce = require('lodash.debounce'); //Подключаем библеотеку задержки
let contextUl = document.querySelector('.country-list');
const DEBOUNCE_DELAY = 300;
const chowSearch = Swal.mixin({
  //Стилизуем вспл окно когда мало букв для поиска
  background: '#5bd8d1',
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
const chowNotFound = Swal.mixin({
  //Стилизуем вспл окно когда ниче не найдено
  background: '#ff0000',
  color: '#ffffff',
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timerProgressBar: true,
  icon: 'error',
  width: '30%',
  iconColor: '#008080',
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
      if (posts.status >= 400) {
        //Проверяем ошибку 400
        chowNotFound.fire({
          title: 'Oops, there is no country with that name',
        });
        return;
      }
      if (posts.length > 10) {
        //Проверем достаточность знаков в поле input
        chowSearch.fire({
          title: 'Too many matches found. Please enter a more specific name',
        });
      } else {
        //Логика для разметки HTML, если найдено стран от2 до 10
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
      if (posts.length <= 1 && posts.length != 0) {
        //Логика для разметки HTML, если найдена 1 страна
        let getLanguages;
        let languagesAll = '';
        let gs = Object.keys(posts[0].languages);
        for (let g of gs) {
          // Извлекаем языки из объекта
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
const textInput = document.querySelector('#search-box'); //Слухавка для iput
textInput.addEventListener('input', event => {
  let cantryName = event.currentTarget.value.trim();
  fetchCountries(cantryName);
});
