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


  //header basket counter

  document.querySelectorAll('.js-header-basket').forEach((headerBasket) => {
    const totalPrice = headerBasket.querySelector('.js-header-basket__total-price');
    let totalPriceValue = 0;
    let productPrices = headerBasket.querySelectorAll('.js-header-basket__item-price');
    const totalProductQuantitys = document.querySelectorAll('.js-header-basket__quantity');
  
    emptyTotalQuantity(calcTotalQuantity ());

    headerBasket.querySelectorAll('.js-header-basket__item').forEach((baskeItem) => {
      const btnUp = baskeItem.querySelector('.js-header-basket__item-btn-up');
      const btnDown = baskeItem.querySelector('.js-header-basket__item-btn-down');
      const inputAmount = baskeItem.querySelector('.js-header-basket__item-amount');
      const productTotalPrice = baskeItem.querySelector('.js-header-basket__item-price');
      const productPrice = +productTotalPrice.getAttribute('data-price');

      let inputAmountVal = +inputAmount.getAttribute('value');
      let inputAmountMax = 9999;
      if (inputAmount.hasAttribute('max')) {
        inputAmountMax = +inputAmount.getAttribute('max');
      }

      let inputAmountMin = 1;
      if (inputAmount.hasAttribute('min')) {
        inputAmountMin = +inputAmount.getAttribute('min');
      }

      inputAmount.innerText = inputAmountVal;
      productTotalPrice.innerText = inputAmountVal * productPrice;
      calcTotalPrice();

      btnUp.addEventListener('click', () => {
        if (inputAmountVal < inputAmountMax) {
          inputAmountVal += 1;
          inputAmount.value = inputAmountVal;
          productTotalPrice.innerText = inputAmountVal * productPrice;
        }
      })

      btnDown.addEventListener('click', () => {
        if (inputAmountVal > inputAmountMin) {
          inputAmountVal -= 1;
          inputAmount.value = inputAmountVal;
          productTotalPrice.innerText = inputAmountVal * productPrice;
        }
      })

      inputAmount.addEventListener('input', (event) => {
        if (!isNaN(inputAmount.value)) {
          if (+inputAmount.value > inputAmountMax) {
            inputAmount.value = inputAmountMax;
            inputAmountVal = inputAmount.value;
            productTotalPrice.innerText = inputAmountVal * productPrice;
          } else if (+inputAmount.value < inputAmountMin && +inputAmount.value.length !== 0) {
            inputAmountVal = inputAmountMin;
            productTotalPrice.innerText = inputAmountMin * productPrice;
          } else if (+inputAmount.value.length === 0) {
            productTotalPrice.innerText = inputAmountMin * productPrice;
          } else {
            inputAmountVal = +inputAmount.value;
            productTotalPrice.innerText = inputAmountVal * productPrice;
          }
        } else if (isNaN(+inputAmount.value) && event.data !== null) {
          inputAmount.value = inputAmount.value.replace(/\D/g, '');
        }
      })

      inputAmount.addEventListener('change', () => {
        if (inputAmount.value === '') {
          inputAmountVal = inputAmount.value = inputAmountMin;
          productTotalPrice.innerText = inputAmountVal * productPrice;
        }
        else if (+inputAmount.value < inputAmountMin) {
          inputAmountVal = inputAmount.value = inputAmountMin;
          productTotalPrice.innerText = inputAmountVal * productPrice;
        }
      })

    })

    headerBasket.addEventListener('input', () => {
      console.log('Изменение');
      calcTotalPrice();

    })

    headerBasket.addEventListener('click', (event) => {
      if (!event.target.classList.contains('header-basket__link')) {
        calcTotalPrice();

      }
    })

    function calcTotalPrice() {
      for (let i = 0; i < productPrices.length; i++) {
        totalPriceValue += +productPrices[i].innerText;
      }
      totalPrice.innerText = totalPriceValue;
      totalPriceValue = 0;
    }

    function calcTotalQuantity () {
      return headerBasket.querySelectorAll('.js-header-basket__item').length;
    }

    function emptyTotalQuantity (totalQuantity) {
      for (let i = 0; i < totalProductQuantitys.length; i++) {
        totalProductQuantitys[i].innerText = totalQuantity;
      }
    }

  })



};