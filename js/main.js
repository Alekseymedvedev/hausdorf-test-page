// input type="file" клонируем и удаляем элемент, 

const inputBtn = document.querySelector('.form__file-btn');
const templateFile = document.querySelector('.template-file');
const templateFileBox = document.querySelector('.form__file-box');


inputBtn.addEventListener('click', function () {

  // При клике на кнопку клонируем элемент
  const clone = templateFile.content.cloneNode(true);
  templateFileBox.prepend(clone);

  // После получаем инпут и кнопку для удаления
  const inputFile = document.querySelectorAll('.form__file-input');
  const templateFileBtnRemove = document.querySelectorAll('.form__file-input-remove');

  // Эмуляция клика на первый инпут в массиве(он всегда пустой, т.к. только склонирован из шаблона)
  inputFile[0].click();

  // Слушаем событие у первого в массиве инпута
  inputFile[0].addEventListener('change', function () {

    // Получаем имя загруженого файла и убираем не нужный путь
    const fileName = this.value.split('\\').pop();

    // Получаем обертку у этого инпута
    const templateFileInner = this.closest('.form__file-item');

    // Получаем элемент в который удем добавлять имя файла
    const templateFileText = templateFileInner.querySelector('.form__file-item-text');

    templateFileInner.classList.remove('hidden')
    templateFileText.innerHTML = fileName;

  });

  // Удаляем инпут по клику
  templateFileBtnRemove.forEach(function (item) {
    item.addEventListener('click', function () {

      this.closest('.form__file-item').remove();

    })
  })
});

// Выпадающий список
document.querySelectorAll('.dropdown').forEach(function (dropDownWrapper) {
  const dropDownBtn = dropDownWrapper.querySelector('.dropdown__button');
  const dropDownList = dropDownWrapper.querySelector('.dropdown__list');
  const dropDownListItems = dropDownList.querySelectorAll('.dropdown__list-item');
  const dropDownInput = dropDownWrapper.querySelector('.dropdown__input-hidden');
  const dropDownInputCity = document.querySelector('.dropdown__input-city');

  // Клик по кнопке. Открыть/Закрыть select
  dropDownBtn.addEventListener('click', function (e) {
    dropDownList.classList.toggle('dropdown__list--visible');
    this.closest('.dropdown__box').classList.add('dropdown__box--active');
  });

  // Выбор элемента списка. Запомнить выбранное значение
  dropDownListItems.forEach(function (listItem) {
    listItem.addEventListener('click', function (e) {
      e.stopPropagation();
      dropDownBtn.innerText = this.innerText;
      dropDownBtn.focus();
      dropDownList.classList.remove('dropdown__list--visible');
      dropDownList.closest('.dropdown').querySelector('.dropdown__box').classList.remove('dropdown__box--active');
      this.classList.add('active');
      
      // Передаем данные в инпут для отправки формы
      if (listItem.classList.contains('dropdown__list-item-cor')) {
        dropDownInputCity.value = this.dataset.value;
      }else{
        dropDownInput.value = this.dataset.value;
      }

      // Получаем координаты для передвижения метки по каарте
      cityCoordinatesArr = [+this.dataset.cityCoordinates, +this.dataset.cityCoordinates1];
    });
  });

  // Клик снаружи дропдауна. Закрыть дропдаун
  document.addEventListener('click', function (e) {
    if (e.target !== dropDownBtn) {
      dropDownBtn.closest('.dropdown__box').classList.remove('dropdown__box--active');
      dropDownList.classList.remove('dropdown__list--visible');
    }
  });

});

// Проверяем выбран ли чекбокс, если нет дизейблим кнопку
const checkLabel = document.querySelector('.check-label');
const checkInput = document.querySelector('.check-input');
const formBtn = document.querySelector('.form__btn');

checkLabel.addEventListener('click', function(){
  if(checkInput.checked){
    formBtn.classList.remove('form__btn--disabled');
    formBtn.removeAttribute('disabled','disabled');
  }
  else{
    formBtn.classList.add('form__btn--disabled');
    formBtn.setAttribute('disabled','disabled');
  }
})

// Иницилизация карты

ymaps.ready(function () {
  
  const dropDownListItem = document.querySelectorAll('.dropdown__list-item-cor');

  var myMap = new ymaps.Map('map', {
      center: [44.006516, 44.006516],
      zoom: 2
    }, {
      searchControlProvider: 'yandex#search'
    }),

    myPlacemark = new ymaps.Placemark(myMap.getCenter(), {

    }, {

      iconLayout: 'default#image',
      iconImageHref: '../images/ymap-icon.png',
      iconImageSize: [91, 100],
    });

    // При клике перемещаем метку на карте
    dropDownListItem.forEach(function (Item) {
    Item.addEventListener('click', function (e) {
      let coords = [+this.dataset.cityCoordinates, +this.dataset.cityCoordinates1];

      if (myPlacemark) {
        myPlacemark.geometry.setCoordinates(coords);
      }

    });
  });

  myMap.geoObjects.add(myPlacemark);

  myMap.behaviors.disable('scrollZoom');
});