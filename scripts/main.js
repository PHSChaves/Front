function init() {
  mainBannerSlide();
  getShelfProducts();
  cartQuantity();
  newsLetter();
}

function mainBannerSlide(){
  const mainBanner = $(".main-banner")
  $(mainBanner).slick({
    dots:true,
    arrows:false,
    autoplay: true,
    infinite: true,
    autoplaySpeed: 3000
  });

  if ($(window).width() < 768) {
    $(mainBanner).find('img').attr('src', 'img/Banner-mobile.jpg');
  } else {
    $(mainBanner).find('img').attr('src', 'img/banner.jpg');
  }
  
}

function getShelfProducts(){
  $.ajax({
    url: "https://corebiz-test.herokuapp.com/api/v1/products",
    dataType: "json",
    type: "GET"
  }).done(function(data) {

    console.log(data);
    formatProduct(data);
    addToCart();
    });
}

function formatProduct(products){

  for (let product of products) {
    let productName = product.productName,
      imageUrl = product.imageUrl,
      listPrice = product.listPrice,
      price = (product.price / 100).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}),
      productId = product.productId,
      stars = product.stars,
      installmentsQty,
      installmentsValue; 
      
    if(product.installments[0]) {

      installmentsQty = product.installments[0].quantity;
      installmentsValue = (product.installments[0].value/100).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

    }

    if(listPrice != null) {
      listPrice = (listPrice/100).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

    }

    let productHtml =` 
    <div class="shelf__item" id="${productId}" data-product-name="${productName}">
          <div class="product-image">
            <img src="${imageUrl}"  alt="" class="product-image">
            
              ${listPrice ? '<p class="product-flag"></p>' : ''}
            </div>
          <div class="product-info">
              <p class="product-info__name">${productName}</p>
              <div class="product-info__rating" data-rate=${stars}>
                
              </div>
              <div class="product-info__price"> 
                <p class="list-price">${listPrice ? 'de ' + listPrice : ''}</p>
                <p class="price"> Por ${price}</p>
              </div>
              <p class="product-info__installment">${installmentsQty ? 'ou em ' + installmentsQty + 'x de ' + installmentsValue : ''}</p>                    
          </div>
          <button class="buy-btn">COMPRAR</button>
      </div>
      `;
    $(".shelf__content").append(productHtml);
  }
  productStars();
  shelfSlide();

}

function shelfSlide(){
  $(".shelf__content").slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
          slidesToShow: 2,
        }
      }
    ]
  });

}

function productStars() {
  $('.shelf__item').each(function(){

    let productRate = $(this).find('.product-info__rating').attr('data-rate'),
        item = $(this);

    for(let i = 0; i < 5; i++) {
      if (i < productRate) {
        $(item).find('.product-info__rating').append(`<span class="star checked"></span>`)
      } else {
        $(item).find('.product-info__rating').append(`<span class="star"></span>`)
      }
    } 
  })
}

function addToCart() {
  let buyButton = $('.buy-btn'),
      productQuantity = 0,
      cart = $('.cart-quantity');


  $(buyButton).on('click', function(){
    productQuantity += 1;
    let productName = $(this).parent().attr('data-product-name');
    localStorage.setItem(productQuantity, productName);
    
    $(cart).text(localStorage.length);
  })
}

function cartQuantity() {
  let cart = $('.cart-quantity');
  $(cart).text(localStorage.length);
}

function newsLetter() {
  
  $('.news-form').on('submit', function(e){
    e.preventDefault();

    const validateEmail = function(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    };

    let name = $('.news-form .name').val();
    let email = $('.news-form .email').val();

    let data = {
      email: email,
      name: name
    }

    if (name != "" && email != "" && validateEmail(email)) {  
      $.ajax({
        url: "https://corebiz-test.herokuapp.com/api/v1/newsletter",
        type: "POST",
        data: JSON.stringify(data),
        headers: {
          "Content-type" : "application/json",
          "Accept" : "application/json"
        },
        success: function (res){
          console.log(res);
          newSubmitForm();
        },
        error: function (erro){
          console.log(erro);
        }
      });
      

    } else if (email === '' || !validateEmail(email)) {
      $('.news-form__box-mail .email').css({'border': '1px solid red', 'transition': 'none'});
      $('.news-form__box-mail .error-email').css({'opacity': '1', 'transition': 'none'});

      setTimeout(function(){
        $('.news-form__box-mail .email').css({'border': 'none', 'transition': 'opacity 1s ease-in-out'});
        $('.news-form__box-mail .error-email').css({'opacity':'0', 'transition' : 'opacity 1s ease-in-out'});
      }, 2000)
    } if (name === '') {
      $('.news-form__box-name .name').css({'border': '1px solid red', 'transition': 'none'});
      $('.news-form__box-name .error-name').css({'opacity': '1', 'transition': 'none'});

      setTimeout(function(){
        $('.news-form__box-name .name').css({'border': 'none', 'transition': 'opacity 1s ease-in-out'});
        $('.news-form__box-name .error-name').css({'opacity':'0', 'transition' : 'opacity 1s ease-in-out'});
      }, 2000)
    }

  })
}

function newSubmitForm() {
  $('.newsletter__content').hide();
  $('.newsletter-success').show();

  $('.submit-again').on('click', function(){
    $('.newsletter-success').hide();
    $('.newsletter__content').show();
  })

  $('.news-form .name').val('');
  $('.news-form .email').val('');
}

init();
