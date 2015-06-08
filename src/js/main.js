$(document).ready(function(){
  $('.owl-carousel').owlCarousel({
      navigation : false, // Show next and prev buttons
      slideSpeed : 300,
      paginationSpeed : 400,
      singleItem:true,
      autoPlay:true
    
  });
  $('.owl-logos').owlCarousel({
      autoPlay:true,
    pagination:false,
    navigation: true,
	navigationText: [
      '<i class="glyphicon glyphicon-chevron-left"></i>', 
      '<i class="glyphicon glyphicon-chevron-right"></i>'
    ]
  });
  $('.owl-projects').owlCarousel({
    navigation: false,
    items: 3
  })
});