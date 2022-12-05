export function isScript() {

  //drop=======================================================================

  document.querySelectorAll('.js-drop-box').forEach((dropBox) => {
    const dropBoxBtn = dropBox.querySelector('.js-drop-box__btn');
    const dropBoxOpenBlock = dropBox.querySelector('.js-drop-box__open-block');

    document.addEventListener('click', (event) => {
      if (event.composedPath().includes(dropBoxBtn)) {
        dropBoxBtn.classList.toggle('_active');
        dropBoxOpenBlock.classList.toggle('_active');
      } else if (!event.composedPath().includes(dropBoxOpenBlock)) {
        dropBoxBtn.classList.remove('_active');
        dropBoxOpenBlock.classList.remove('_active');
      }
    })

  })

  //tabs=================================================================

  if (document.querySelectorAll('.js-tabs').length > 0) {
    document.querySelectorAll('.js-tabs').forEach((tab) => {
      let tabBtn = tab.querySelectorAll('.js-tabs__btn');
      let tabItem = tab.querySelectorAll('.js-tabs__item');

      //first active tab
      tabBtn[0].classList.add('_active');
      tabItem[0].classList.add('_active');

      for (let i = 0; i < tabBtn.length; i++) {
        if (tabBtn[i].classList.contains('_active')) {
          tabBtn[0].classList.remove('_active');
          tabItem[0].classList.remove('_active');
          tabBtn[i].classList.add('_active')
          tabItem[i].classList.add('_active')
        }
      }
      for (let i = 0; i < tabBtn.length; i++) {
        //default active tab
        if (tabBtn[i].classList.contains('_active')) {
          tabItem[i].classList.add('_active');
        }

        //switch js-tabs on click
        tabBtn[i].addEventListener('click', () => {
          for (let i = 0; i < tabBtn.length; i++) {
            tabBtn[i].classList.remove('_active');
          }
          tabBtn[i].classList.add('_active');
          let tabName = tabBtn[i].getAttribute('data-tab-name');
          for (let k = 0; k < tabItem.length; k++) {
            tabItem[k].classList.remove('_active');
            if (tabItem[k].getAttribute('data-tab-name') === tabName) {
              tabItem[k].classList.add('_active');
            }
          }
        })
      }
    });
  }

  //Header - basket

  document.querySelectorAll('.js-header-basket').forEach((basket) => {
    let productList = basket.querySelector('.js-header-basket__products');
    let totalNums = document.querySelectorAll('.js-header-basket__quantity');
    let totalPrices = document.querySelectorAll('.js-header-basket__total-price');
    let allProductsInput = basket.querySelectorAll('.js-header-basket__item-amount');
    let allProductsPrice = basket.querySelectorAll('.js-header-basket__item-price');
    let totalNumCount = 0;
    let totalPriceCount = 0;
    let productHeight = 0;

    let buttonUp;
    let buttonDown;
    let product;
    let input;
    let price;
    let singlePrice;
    let removeBtn;
    let min;
    let max;

    //Стартовые настройки для каждого товара
    basket.querySelectorAll('.js-header-basket__item').forEach((oneProduct) => {

      input = oneProduct.querySelector('.js-header-basket__item-amount');
      price = oneProduct.querySelector('.js-header-basket__item-price');
      singlePrice = +price.getAttribute('data-price');

      price.textContent = singlePrice * +input.value;
    })

    countAndAddTotalNum(min); //Стартовая настройка количества товаров
    countAndAddTotalPrice(); //Стартовая настройка суммарной стоимости товаров

    //события при клике на Кнопки
    basket.addEventListener('click', (event) => {

      if (event.target.classList.contains('js-header-basket__item-btn-up')) {
        buttonUp = event.target;
        product = buttonUp.closest('.js-header-basket__item');
        input = product.querySelector('.js-header-basket__item-amount');
        price = product.querySelector('.js-header-basket__item-price');
        singlePrice = +price.getAttribute('data-price');
        min = +input.getAttribute('min');
        max = +input.getAttribute('max');

        if (+input.value < max) {
          input.value = +input.value + 1;
          price.textContent = singlePrice * +input.value;
        }
        countAndAddTotalNum(min);
        countAndAddTotalPrice();
      }

      if (event.target.classList.contains('js-header-basket__item-btn-down')) {
        buttonDown = event.target;
        product = buttonDown.closest('.js-header-basket__item');
        input = product.querySelector('.js-header-basket__item-amount');
        price = product.querySelector('.js-header-basket__item-price');
        singlePrice = +price.getAttribute('data-price');
        min = +input.getAttribute('min');
        max = +input.getAttribute('max');

        if (+input.value > min) {
          input.value = +input.value - 1;
          price.textContent = singlePrice * +input.value;
        }
        countAndAddTotalNum(min);
        countAndAddTotalPrice();
      }

      if (event.target.classList.contains('js-header-basket__item-del-btn')) {
        removeBtn = event.target;
        product = removeBtn.closest('.js-header-basket__item');

        productHeight = product.offsetHeight;//высота блока
        let replaceBlock = document.createElement('div');
        replaceBlock.classList.add('js-replace-header-basket-product');
        replaceBlock.style.height = `${productHeight}px`;
        product.classList.add('_remove');


        setTimeout(() => {
          product.replaceWith(replaceBlock);

          setTimeout(() => {
            replaceBlock.style.height = `${0}px`;
          }, 0);

        }, 300);
      }

    })


    //События при нипуте на поле ввода

    basket.addEventListener('input', (event) => {
      if (event.target.classList.contains('js-header-basket__item-amount')) {
        input = event.target;
        product = input.closest('.js-header-basket__item');
        price = product.querySelector('.js-header-basket__item-price');
        singlePrice = +price.getAttribute('data-price');
        min = +input.getAttribute('min');
        max = +input.getAttribute('max');

        //Все проверки для ручного ввода инпут
        if (!isNaN(+input.value) && input.value.length > 0) {
          if (+input.value > max) {
            input.value = max;
            price.textContent = singlePrice * input.value;
            countAndAddTotalNum(min);
            countAndAddTotalPrice();

          } else if (+input.value <= 0) {
            input.value = min;
            price.textContent = singlePrice * input.value;
            countAndAddTotalNum(min);
            countAndAddTotalPrice();

          } else if (+input.value < min) {
            price.textContent = singlePrice * min;
            countAndAddTotalNum(min);
            countAndAddTotalPrice();
          }
          else {
            price.textContent = singlePrice * input.value;
            countAndAddTotalNum(min);
            countAndAddTotalPrice();
          }
        } else if (input.value.length === 0) {
          price.textContent = singlePrice * min;
          countAndAddTotalNum(min);
          countAndAddTotalPrice();

        }
        else if (isNaN(+input.value)) {
          input.value = input.value.replace(/\D/g, '');
        }
      }
    })

    basket.addEventListener('change', (event) => {
      if (event.target.classList.contains('js-header-basket__item-amount')) {
        input = event.target;
        product = input.closest('.js-header-basket__item');
        price = product.querySelector('.js-header-basket__item-price');
        singlePrice = +price.getAttribute('data-price');
        min = +input.getAttribute('min');
        max = +input.getAttribute('max');

        if (input.value.length === 0) {
          input.value = min;
          price.textContent = singlePrice * input.value;
          countAndAddTotalNum(min);
          countAndAddTotalPrice();
        } else if (input.value < min) {
          input.value = min;
          countAndAddTotalNum(min);
          countAndAddTotalPrice();
        }

      }
    })

    function countAndAddTotalNum(min) {
      for (let i = 0; i < allProductsInput.length; i++) {

        if (+allProductsInput[i].value.length === 0) {
          totalNumCount += min;
        } else {
          totalNumCount += Number(allProductsInput[i].value);
        }

      }

      for (let i = 0; i < totalNums.length; i++) {
        totalNums[i].textContent = totalNumCount;
      }
      totalNumCount = 0;
    }

    function countAndAddTotalPrice() {
      for (let i = 0; i < allProductsPrice.length; i++) {
        totalPriceCount += Number(allProductsPrice[i].textContent)
      }

      for (let i = 0; i < totalPrices.length; i++) {
        totalPrices[i].textContent = totalPriceCount;
      }

      totalPriceCount = 0;
    }


    // Отслеживание изменений 
    let observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {

        if (mutation.type === 'childList') {
          allProductsInput = basket.querySelectorAll('.js-header-basket__item-amount');
          allProductsPrice = basket.querySelectorAll('.js-header-basket__item-price');

          countAndAddTotalPrice();
          countAndAddTotalNum(1);
        }


      });
    });

    observer.observe(productList, { childList: true });

  });

  //proposition-slider (index)========================================================

  let propositionSlider = new Swiper('.proposition-slider', {
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    navigation: {
      nextEl: '.proposition-slider__arrow-next',
      prevEl: '.proposition-slider__arrow-prev',
    },
    pagination: {
      el: '.proposition-slider__progressbar',
      type: 'progressbar',
    },
  });
  if (document.querySelector('.proposition-slider')) {
    let currentSlidePropositionSlider = document.querySelector('.proposition-slider__fraction-current');
    let totalSlidePropositionSlider = document.querySelector('.proposition-slider__fraction-total');
    let totalSlides = propositionSlider.slides.length;
    totalSlidePropositionSlider.textContent = addZero(totalSlides);
    let currentSlide = ++propositionSlider.realIndex;
    currentSlidePropositionSlider.textContent = addZero(currentSlide);

    propositionSlider.on('slideChange', () => {
      currentSlide = ++propositionSlider.realIndex;
      currentSlidePropositionSlider.textContent = addZero(currentSlide);
    })

    function addZero(item) {
      if (item <= 9) {
        return `0${item}`;
      } else {
        return item;
      }
    }
  }


  //recommendations-slider (index)===========================================================

  new Swiper('.recommendations-slider', {
    slidesPerView: 1.2,
    spaceBetween: 16,
    navigation: {
      nextEl: '.recommendations-slider__arrow-next',
      prevEl: '.recommendations-slider__arrow-prev',
    },
    breakpoints: {
      1240: {
        slidesPerView: 5.2,
      },
      1010: {
        slidesPerView: 4.2,
      },
      800: {
        slidesPerView: 3.2,
      },
      600: {
        slidesPerView: 2.2,
      },
    },
  });

  // add margin for main-block

  const mainBlock = document.querySelector('.js-main-block');
  const header = document.querySelector('.js-header');

  let headerHeight = header.offsetHeight;
  mainBlock.style.marginTop = `${headerHeight}px`;

  window.addEventListener('resize', () => {
    headerHeight = header.offsetHeight;
    mainBlock.style.marginTop = `${headerHeight}px`;
  })



  //RESIZE WINDOW===========================================================
  const headerCallbackIcon = document.querySelector('.js-header-call-back-icon');
  const headerCallbackBtn = document.querySelector('.js-header-call-back-btn');
  const headerCallbackNum = document.querySelector('.js-header-call-back-num');

  const headerAccountText = document.querySelector('.js-header-account-text');

  const headerLogo = document.querySelector('.js-header-logo');
  const headerSearch = document.querySelector('.js-header-search');
  const bottomNav = document.querySelector('.js-header-bottom-nav');

  const callBackBlock = document.querySelector('.js-header__call-back');
  const openSearchBtn = document.querySelector('.js-header-search-open');
  const headerBottomInner = document.querySelector('.js-header__bottom-inner');
  const headerSearcInput = document.querySelector('.header__search-input');

  function rebuildAdaptation() {
    if (window.innerWidth <= 1200) {
      headerCallbackIcon.remove();
      headerCallbackNum.prepend(headerCallbackIcon);

      headerAccountText.innerText = 'Акаунт';

      headerSearch.remove();
      headerLogo.after(headerSearch);
    } else if (window.innerWidth > 1200) {
      headerCallbackIcon.remove();
      headerCallbackBtn.prepend(headerCallbackIcon);

      headerAccountText.innerText = 'Увійти до облікового запису';

      headerSearch.remove();
      bottomNav.after(headerSearch);
    }

    if(window.innerWidth <= 850) {
      callBackBlock.remove();
      headerBottomInner.append(callBackBlock);
      headerSearcInput.placeholder = 'Пошук по сайту';
      
      buildMobileMenu();
    } else if (window.innerWidth > 850) {
      callBackBlock.remove();
      openSearchBtn.before(callBackBlock);

      buildDesctopMenu()
    }
  }

  function buildMobileMenu() {
    
  }

  function buildDesctopMenu() {
    
  }
  

  rebuildAdaptation();
  window.addEventListener('resize', rebuildAdaptation);

  //work mobile menu

  const menuBtn = document.querySelector('.js-menu-btn')

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('_active');
  })

  //open mobile search


  openSearchBtn.addEventListener('click', () => {
    openSearchBtn.classList.toggle('_active');
    headerSearch.classList.toggle('_active');
  })


  console.log();





















};