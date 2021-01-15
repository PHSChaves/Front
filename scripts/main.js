function init() {
  mainBannerSlide();
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

init();