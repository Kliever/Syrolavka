export function isScript() {

  //scroll block===============================================================================

  let marginScrollBody = document.querySelector('body');
  let marginFixedElement = document.querySelectorAll('.js-scroll-padding');
  marginScrollBody.style.position = 'relative';

  //color scroll block
  let marginScrollBgColor = '#ffffff';
  if (marginScrollBody.hasAttribute('data-margin-scroll-color')) {
    marginScrollBgColor = marginScrollBody.getAttribute('data-margin-scroll-color');
  }

  //width scroll block
  let marginScrollWidth = window.innerWidth - marginScrollBody.clientWidth;
  if (marginScrollBody.hasAttribute('data-margin-scroll-width')) {
    marginScrollWidth = marginScrollBody.getAttribute('data-margin-scroll-width');
  }

  //create and add scroll block
  let newMarginScrollBar = document.createElement('div');
  newMarginScrollBar.style.height = '0';
  newMarginScrollBar.style.width = '0';
  newMarginScrollBar.style.top = '0';
  newMarginScrollBar.style.right = '0';
  newMarginScrollBar.style.position = 'fixed';
  newMarginScrollBar.style.zIndex = '100';
  newMarginScrollBar.style.backgroundColor = marginScrollBgColor;
  marginScrollBody.append(newMarginScrollBar);

  //add padding for fixed element
  function addScrollPaddingFixedElement() {
    if (marginFixedElement.length > 0) {
      for (let i = 0; i < marginFixedElement.length; i++) {
        marginFixedElement[i].style.paddingRight = `${marginScrollWidth}px`;
      }
    }
  }

  //remove padding for fixed element
  function removeScrollPaddingFixedElement() {
    if (marginFixedElement.length > 0) {
      for (let i = 0; i < marginFixedElement.length; i++) {
        marginFixedElement[i].style.paddingRight = '0';
      }
    }
  }

  //add margin for body
  function addScrollMargin() {
    newMarginScrollBar.style.height = `100vh`;
    newMarginScrollBar.style.width = `${marginScrollWidth}px`;
    marginScrollBody.style.marginRight = `${marginScrollWidth}px`;
    addScrollPaddingFixedElement();
  }

  //remove margin for body
  function removeScrollMargin() {
    newMarginScrollBar.style.height = `0`;
    newMarginScrollBar.style.width = `0`;
    marginScrollBody.style.marginRight = `0`;
    removeScrollPaddingFixedElement();
  }

  //drop=======================================================================

  document.querySelectorAll('.js-drop-box').forEach((dropBox) => {
    const dropBoxBtn = dropBox.querySelector('.js-drop-box__btn');
    const dropBoxOpenBlock = dropBox.querySelector('.js-drop-box__open-block');

    document.addEventListener('click', (event) => {
      if (event.composedPath().includes(dropBoxBtn)) {
        dropBoxBtn.classList.toggle('_active');
        dropBoxOpenBlock.classList.toggle('_active');
        if (dropBoxBtn.classList.contains('_active') && window.innerWidth <= 650) {
          addScrollMargin();
          marginScrollBody.classList.add('_overflow-hidden');

        } else if (!dropBoxBtn.classList.contains('_active') && window.innerWidth <= 650) {
          removeScrollMargin();
          marginScrollBody.classList.remove('_overflow-hidden');
        }
      } else if (!event.composedPath().includes(dropBoxOpenBlock)) {
        dropBoxBtn.classList.remove('_active');
        dropBoxOpenBlock.classList.remove('_active');
        if (dropBoxBtn.classList.contains('_active')) {
          removeScrollMargin();
          marginScrollBody.classList.remove('_overflow-hidden');
        }
      }
    })

    window.addEventListener('resize', () => {
      if (dropBoxBtn.classList.contains('_active') && window.innerWidth > 650) {
        removeScrollMargin();
        marginScrollBody.classList.remove('_overflow-hidden');
      } else if (dropBoxBtn.classList.contains('_active') && window.innerWidth <= 650) {
        addScrollMargin();
        marginScrollBody.classList.add('_overflow-hidden');
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

  //Header - basket---------------------------------------------

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


    //События при инпуте на поле ввода

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
    slidesPerView: 1,
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

  //header-search open mobile ===================================================
  const headerSearchOpen = document.querySelector('.js-header-search-open');
  const headerSearch = document.querySelector('.js-header-search');

  headerSearchOpen.addEventListener('click', () => {
    headerSearchOpen.classList.toggle('_active');
    headerSearch.classList.toggle('_active');
  })

  // add margin for main-block=================================================

  const mainBlock = document.querySelector('.js-main-block');
  const header = document.querySelector('.js-header');
  const mobileMenu = document.querySelector('.js-mobile-menu');
  let headerHeight = header.offsetHeight;

  addMarginMenu();

  window.addEventListener('resize', () => {
    headerHeight = header.offsetHeight;
    addMarginMenu();
  })

  function addMarginMenu() {
    mainBlock.style.marginTop = `${headerHeight}px`;
    mobileMenu.style.marginTop = `${headerHeight}px`;
    mobileMenu.style.height = `${window.innerHeight - headerHeight}px`;
  }

  // add height for header basket==============================================

  const headerBasketBlock = header.querySelector('.js-header-basket-block');
  const headerTop = header.querySelector('.js-header-top');
  const headerMiddle = header.querySelector('.js-header-middle');

  addHeightHeaderBasket();
  window.addEventListener('resize', () => {
    addHeightHeaderBasket();
  })

  function addHeightHeaderBasket() {
    if (window.innerWidth <= 650) {
      headerBasketBlock.style.height = `${window.innerHeight - (headerTop.offsetHeight + headerMiddle.offsetHeight)}px`;
      headerBasketBlock.style.maxHeight = `none`;
    } else {
      headerBasketBlock.style.maxHeight = `${590}px`;
      headerBasketBlock.style.height = `${window.innerHeight - (headerTop.offsetHeight + headerMiddle.offsetHeight)}px`;
    }
  }

  //open / close mobile menu ====================================================

  const menuBtn = document.querySelector('.js-menu-btn');

  menuBtn.addEventListener('click', () => {
    if (menuBtn.classList.contains('_active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }

  })
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1200) {
      closeMobileMenu();
    }
  })

  function openMobileMenu() {
    menuBtn.classList.add('_active');
    mobileMenu.classList.add('_active');
    addScrollMargin();
    marginScrollBody.classList.add('_overflow-hidden');
  }

  function closeMobileMenu() {
    menuBtn.classList.remove('_active');
    mobileMenu.classList.remove('_active');

    setTimeout(() => {
      removeScrollMargin();
      marginScrollBody.classList.remove('_overflow-hidden');
    }, 300);


  }


  //build and work mobile menu============================================================
  const headerLogo = header.querySelector('.js-header-logo');
  const mobileMenuBack = mobileMenu.querySelector('.js-mobile-menu-back');
  const mobileMenuBotBlock = mobileMenu.querySelector('.js-mobile-menu-bot-block');
  const mainSectionInner = document.querySelector('.js-main-section-inner');
  const headerTopNav = document.querySelector('.js-header-top-nav');
  const headerBottomNav = header.querySelector('.js-header-bottom-nav');
  const headerBottomInner = header.querySelector('.js-header-bottom-inner');
  const headerCallBackNum = header.querySelector('.js-header-call-back-num');
  const headerCallBackBtn = header.querySelector('.js-header-call-back-btn');

  const headerMiddleInfoGrid = header.querySelector('.js-header-middle-info-grid');
  const mainMenu = document.querySelector('.js-main-menu');
  const headerSocialList = header.querySelector('.js-header-social-list');
  const topNavList = header.querySelector('.js-top-nav-list');
  const bottomNavList = header.querySelector('.js-bottom-nav-list');
  const headerCallBack = header.querySelector('.js-header-call-back');
  const headerAccountText = header.querySelector('.js-header-account-text');
  const headerCallBackIcon = header.querySelector('.js-header-call-back-icon');

  const mobileMenuBackBtn = mobileMenu.querySelector('.js-mobile-menu-back-btn');
  const mobileMenuName = mobileMenu.querySelector('.js-mobile-menu-name');



  function buildMenu() {

    if (window.innerWidth <= 1200) {
      headerMiddleInfoGrid.remove();
      mobileMenuBack.prepend(headerMiddleInfoGrid);

      headerSocialList.remove();
      mobileMenuBotBlock.after(headerSocialList);

      mainMenu.remove();
      mobileMenuBotBlock.append(mainMenu);

    } else {
      headerMiddleInfoGrid.remove();
      headerLogo.after(headerMiddleInfoGrid);

      headerSocialList.remove();
      headerMiddleInfoGrid.after(headerSocialList);

      mainMenu.remove();
      mainSectionInner.prepend(mainMenu);

    }

    if (window.innerWidth <= 1100) {
      topNavList.remove();
      mainMenu.append(topNavList);

    } else {
      topNavList.remove();
      headerTopNav.append(topNavList);
    }

    if (window.innerWidth <= 850) {
      bottomNavList.remove();
      mainMenu.append(bottomNavList);

      headerCallBack.remove();
      headerBottomInner.append(headerCallBack);

      headerAccountText.textContent = 'Акаунт';

      headerCallBackIcon.remove();
      headerCallBackNum.prepend(headerCallBackIcon);

    } else {
      bottomNavList.remove();
      headerBottomNav.append(bottomNavList);

      headerCallBack.remove();
      headerSearchOpen.before(headerCallBack);

      headerAccountText.textContent = 'Увійти до облікового запису';

      headerCallBackIcon.remove();
      headerCallBackBtn.prepend(headerCallBackIcon);
    }

  }

  buildMenu();
  window.addEventListener('resize', buildMenu);


  //work mobile menu=======================================================

  document.querySelectorAll('.js-main-menu').forEach((mainMenu) => {
    let mobileMenuBlocks = mainMenu.querySelectorAll('.js-mobile-menu-block');

    let blocksFirstLevel;
    let tempNum = 0;
    let blockHeight = 0;


    buildMenuStartPosition();
    if (window.innerWidth > 1200) {
      mainMenu.style.height = 'auto';
    }
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1200) {
        mainMenu.style.height = 'auto';
      }
      if (!mobileMenuName.classList.contains('_open-menu')) {
        buildMenuStartPosition();
      } else {
        mobileMenuBlocks = mainMenu.querySelectorAll('.js-mobile-menu-block');
        for (let i = 0; i < mobileMenuBlocks.length; i++) {
          if (mobileMenuBlocks[i].classList.contains('_visible')) {
            mobileMenuBlocks[i].classList.remove('_visible');
          }
        }
        buildMenuStartPosition();
        headerMiddleInfoGrid.classList.remove('_hidden');
        mobileMenuBack.classList.remove('_open-menu');
        mobileMenuName.classList.remove('_open-menu');
        mobileMenuBackBtn.textContent = '';
        tempNum = 0;
        blockHeight = 0;
      }

    });

    mainMenu.addEventListener('click', (event) => {
      if (event.target.classList.contains('js-mobile-menu-btn')) {
        for (let i = 0; i < mobileMenuBlocks.length; i++) {
          mobileMenuBlocks[i].classList.remove('_visible');

          if (mobileMenuBlocks[i].style.position === 'relative') {
            mobileMenuBlocks[i].style.position = 'absolute';
          }
        }
        if (event.target.nextElementSibling) {
          event.target.nextElementSibling.classList.add('_visible');
          addActualHeightBlock(event.target.nextElementSibling);
        }
        if (tempNum === 0) {
          headerMiddleInfoGrid.classList.add('_hidden');
          mobileMenuBack.classList.add('_open-menu');
          mobileMenuName.classList.add('_open-menu');
          mobileMenuBackBtn.textContent = 'Головне меню';

        } else {
          mobileMenuBackBtn.textContent = mobileMenuName.textContent;
        }
        mobileMenuName.textContent = event.target.textContent;
        tempNum++;
      }
    });

    mobileMenuBackBtn.addEventListener('click', () => {
      if (tempNum > 1) {
        for (let i = 0; i < mobileMenuBlocks.length; i++) {
          if (mobileMenuBlocks[i].classList.contains('_visible')) {
            mobileMenuBlocks[i].classList.remove('_visible');

            mobileMenuBlocks[i].parentElement.closest('.js-mobile-menu-block').classList.add('_visible');
            addActualHeightBlock(mobileMenuBlocks[i].parentElement.closest('.js-mobile-menu-block'));
            if (tempNum > 2) {
              mobileMenuName.textContent = mobileMenuBackBtn.textContent;
            } else if (tempNum === 2) {
              mobileMenuName.textContent = mobileMenuBackBtn.textContent;
              mobileMenuBackBtn.textContent = 'Головне меню';
            }
          }
        }

      }
      else if (tempNum === 1) {
        headerMiddleInfoGrid.classList.remove('_hidden');
        mobileMenuBack.classList.remove('_open-menu');
        mobileMenuName.classList.remove('_open-menu');
        mobileMenuBackBtn.textContent = '';
        for (let i = 0; i < mobileMenuBlocks.length; i++) {
          if (mobileMenuBlocks[i].classList.contains('_visible')) {
            mobileMenuBlocks[i].classList.remove('_visible');
            blocksFirstLevel = mobileMenuBlocks[i].parentElement.closest('.js-mobile-menu-block');
            blocksFirstLevel = blocksFirstLevel.closest('.js-main-menu');
            break;
          }
        }
        buildMenuStartPosition();
      }
      tempNum--;
    })

    function buildMenuStartPosition() {
      mobileMenuBlocks = mainMenu.querySelectorAll('.js-mobile-menu-block');

      for (let i = 0; i < mobileMenuBlocks.length; i++) {
        if (i === 0) {
          mobileMenuBlocks[i].classList.add('_visible');
          mobileMenuBlocks[i].style.position = 'static';
          blockHeight += mobileMenuBlocks[i].offsetHeight;
          if (mobileMenuBlocks[i].nextElementSibling && mobileMenuBlocks[i].nextElementSibling.classList.contains('js-mobile-menu-block')) {
            blocksFirstLevel = mobileMenuBlocks[i].nextElementSibling;
            blocksFirstLevel.classList.add('_visible');
            blocksFirstLevel.style.position = 'static';
            blockHeight += blocksFirstLevel.offsetHeight;
          }
        } else if (mobileMenuBlocks[i] === blocksFirstLevel) {
          if (mobileMenuBlocks[i].nextElementSibling && mobileMenuBlocks[i].nextElementSibling.classList.contains('js-mobile-menu-block')) {
            blocksFirstLevel = mobileMenuBlocks[i].nextElementSibling;
            blocksFirstLevel.classList.add('_visible');
            blocksFirstLevel.style.position = 'static';
            blockHeight += blocksFirstLevel.offsetHeight;
          }
        }
      }
      if (window.innerWidth <= 1200) {
        mainMenu.style.height = `${blockHeight}px`
      }

      blockHeight = 0;
    }

    function addActualHeightBlock(block) {
      if (window.innerWidth <= 1200) {
        mainMenu.style.height = `${block.offsetHeight}px`;
      }
    }

  })


  //pop up============================================================================

  let openPopupBtns = document.querySelectorAll('.js-open-popup-btn');
  let bodyPopup = document.querySelector('body');
  let popups = document.querySelectorAll('.js-popup');
  let switches = true;
  let popupsWithTime = {};

  if (popups.length > 0) {
    if (openPopupBtns.length > 0) {

      //open popup by click
      for (let i = 0; i < openPopupBtns.length; i++) {
        openPopupBtns[i].addEventListener('click', () => {
          let openPopupBtnAttr = openPopupBtns[i].getAttribute('data-popup-name')

          for (let k = 0; k < popups.length; k++) {
            if (popups[k].classList.contains(openPopupBtnAttr)) {

              for (let i = 0; i < popups.length; i++) {
                popups[i].classList.remove('_active')
              }

              popups[k].classList.add('_active');
              bodyPopup.classList.add('_active-popup');
              switches = false;

              addScrollMargin();
              if (popups[k].hasAttribute('data-open-time')) {
                popups[k].setAttribute('openedonclick', '');
              }
            }
          }
        })
      }

      //close popup
      popups.forEach((popup) => {
        let closePopupBtns = popup.querySelectorAll('.js-popup-close');
        let popupBlackoutArea = popup.querySelector('.js-popup-area');
        let deleyOpenClose = 0.5;

        if (popup.hasAttribute('data-delay-open-close')) {
          deleyOpenClose = +popup.getAttribute('data-delay-open-close') * 1000;
        }

        //close popup for click on button
        for (let i = 0; i < closePopupBtns.length; i++) {
          closePopupBtns[i].addEventListener('click', () => {
            if (popup.classList.contains('_active')) {
              closePopUp(popup, deleyOpenClose);
            }
          })
        }



        //close popup for click on area
        document.addEventListener('click', (e) => {
          if (e.target == popupBlackoutArea) {
            closePopUp(popup, deleyOpenClose);
          }
        })

        //close popup for click on escape
        document.addEventListener('keydown', (event) => {
          if (popup.classList.contains('_active') && (event.key == 'Escape' || event.code == "Escape")) {
            closePopUp(popup, deleyOpenClose);



          }
        })
      });

      //function close popup
      function closePopUp(popup, deleyOpenClose) {
        popup.classList.remove('_active');
        setTimeout(() => {
          bodyPopup.classList.remove('_active-popup');
          switches = true;
          //this place for input function for remove body margin 
          removeScrollMargin();
          setTimeout(() => {
            if (switches) {
              openLazyPopup(popupsWithTime);
            }
          }, 5000);

        }, deleyOpenClose * 1000);

      }
    }

    //open popup for time
    popups.forEach(popup => {
      if (popup.hasAttribute('data-open-time')) {
        let popupOpenTime = +popup.getAttribute('data-open-time');
        setTimeout(() => {
          if (switches && !popup.hasAttribute('openedonclick')) {
            popup.classList.add('_active');
            bodyPopup.classList.add('_active-popup');
            popup.removeAttribute('data-open-time');
            switches = false;
            //this place for input function for add body margin 
            removeScrollMargin();
          } else {
            if (!popup.hasAttribute('openedonclick')) {
              popupsWithTime[+popup.getAttribute('data-open-time')] = popup;
            }
          }
        }, popupOpenTime * 1000);
      }
    })

    function openLazyPopup(popupsWithTime) {

      for (let item in popupsWithTime) {
        if (switches && popupsWithTime.hasOwnProperty(item)) { // <--check for the presence of elements
          popupsWithTime[item].classList.add('_active');
          popupsWithTime[item].classList.add('_active-popup');
          delete popupsWithTime[item];
          switches = false;
        }
      }

    }

  }


  //star-rating===========================================================
  document.querySelectorAll('.js-star-rating').forEach((starRating) => {
    let stars = starRating.querySelectorAll('.js-star-rating-star');
    let rating = +starRating.getAttribute('data-rating');

    for (let i = 0; i < rating; i++) {
      stars[i].classList.add('_full-star');
    }
  })

  //added-to-basket-popup slider============================================

  new Swiper('.basket-popup__slider', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 10,
    navigation: {
      nextEl: '.basket-popup__slider-btn-next',
      prevEl: '.basket-popup__slider-btn-prev'
    },
    breakpoints: {
      550: {
        slidesPerView: 3,
        spaceBetween: 25,
      },
      450: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
    }
  });


  //check parol========================================================

  document.querySelectorAll('.js-registration-form').forEach((form) => {
    const formTargetInputs = form.querySelectorAll('.js-registration-form__target-input');
    const formInputs = form.querySelectorAll('.js-registration-form__input');
    const submitBtn = form.querySelector('.js-registration-form__submit');
    const matchBlock = form.querySelector('.registration-popup__prompt--match');
    const symbolNum = form.querySelector('.registration-popup__prompt--symbol-num');
    let unlock = true;
    let inputValue;

    submitBtn.addEventListener('click', (event) => {
      for (let i = 0; i < formInputs.length; i++) {
        if (formInputs[i].value.length === 0) {
          unlock = false;
          break;
        }
      }
      if (unlock) {
        for (let i = 0; i < formTargetInputs.length; i++) {
          if (i === 0) {
            inputValue = formTargetInputs[i].value;
          } else if (i >= 1 && inputValue !== formTargetInputs[i].value) {
            event.preventDefault();
            unlock = false;
            break;
          }
        }
        if (!unlock) {
          for (let i = 0; i < formTargetInputs.length; i++) {
            formTargetInputs[i].classList.add('_error');
          }
          matchBlock.classList.add('_active');
          setTimeout(() => {
            for (let i = 0; i < formTargetInputs.length; i++) {
              formTargetInputs[i].classList.remove('_error');
            }
          matchBlock.classList.remove('_active');
          }, 3000);
        }

      }

      if (unlock) {
        for (let i = 0; i < formTargetInputs.length; i++) {
          if (formTargetInputs[i].value.length < 8) {
            event.preventDefault();
            unlock = false;
            break;
          }
        }
        if (!unlock) {
          for (let i = 0; i < formTargetInputs.length; i++) {
            formTargetInputs[i].classList.add('_error');
          }
          symbolNum.classList.add('_active');
          setTimeout(() => {
            for (let i = 0; i < formTargetInputs.length; i++) {
              formTargetInputs[i].classList.remove('_error');
            }
            symbolNum.classList.remove('_active');
          }, 3000);
        }
      }
      unlock = true;
    })

  })







};