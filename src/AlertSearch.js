const Swal = require('sweetalert2'); //Подключаем библеотеку вспл. окон
const showSearch = Swal.mixin({
  //Стилизуем вспл окно когда мало букв для поиска
  background: '#5bd8d1', // изумруд, '#ff0000' красный
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
const showNotFound = Swal.mixin({
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
export { showSearch, showNotFound };
