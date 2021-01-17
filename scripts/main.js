function init() {
  mainBannerSlide();
  getShelfProducts();
  cartQuantity();

  newsLetter();
}

function mainBannerSlide(){
    $(".main-banner").slick({
      dots:true,
      arrows:false,
      autoplay: true,
      infinite: true,
      autoplaySpeed: 3000
    });
}

function getShelfProducts(){
  $.ajax({
    url: "https://corebiz-test.herokuapp.com/api/v1/products",
    dataType: "json",
    type: "GET"
  }).done(function(data) {

    console.log(data);
    formatProduct(data);
    shelfSlide();
    productStars();
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
}

function shelfSlide(){
  $(".shelf__content").slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
  });

}

function productStars() {
  $('.shelf__item').each(function(){

    let productRate = $(this).find('.product-info__rating').attr('data-rate'),
        item = $(this);

    for(let i = 0; i < productRate; i++) {
      $(item).find('.product-info__rating').append(`<span class="star checked"></span>`)
    }

    for(let i = $(item).find('.product-info__rating .star').length; i< 5; i++) {
      $(item).find('.product-info__rating').append(`<span class="star"></span>`)
    }
  })
}

function addToCart() {
  let buyButton = $('.buy-btn'),
      productQuantity = 0,
      cart = $('.header-nav__cart .cart-quantity');

  $(buyButton).on('click', function(){
    productQuantity += 1;
    let productName = $(this).parent().attr('data-product-name');
    localStorage.setItem(productQuantity, productName);
    
    $(cart).text(localStorage.length);
  })
}

function cartQuantity() {
  let cart = $('.header-nav__cart .cart-quantity');
  $(cart).text(localStorage.length);
}

function newsLetter() {
  $('.news-form').on('submit', function(e){
    e.preventDefault();

    let name = $('.news-form .name').val();
    let email = $('.news-form .email').val();

    let data = {
      email: email,
      name: name
    }

    if (name != "" && email != "") {
         
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
        },
        error: function (erro){
          console.log(erro);
          alert("Erro");
        }
      });
      

   } else {
      if(email == ''){
        $('.news-form .error-message').text('teste')
      }
   }

  })
}

init();