// Filename: views/home
define([
  'jquery',
  'underscore',
  'backbone',
  'd3',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!templates/home.html'
], function($, _, Backbone, d3, homeTemplate){
  var HomeView = Backbone.View.extend({
    el: '.page',
    render: function(){
      // Using Underscore we can compile our template with data
      var data = {};
      var compiledTemplate = _.template( homeTemplate, data );
      // Append our compiled template to this Views "el"
      this.$el.html( compiledTemplate );
        $('#menu').addClass('hidden');
        $('#homeButton').addClass('selected');
        $('#audienceButton').removeClass('selected');$('#charactersButton').removeClass('selected');$('#factsButton').removeClass('selected');$('#contributeButton').removeClass('selected');
        $('.page').show();
    // Loader

    // Selection des images en src="
    var $elements = $('.page').find('img[src]');
    // Selection des images en background-image
    $('body [style]').each(function() {
      var src = $(this).css('background-image').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
      if(src && src != 'none') {
        $elements = $elements.add($('<img src="' + src + '"/>'));
      }
    });
    
    
    
    var $chargement = $('#chargement');
    var $chargementInfos = $('#chargement-infos');
    var $donuts = $('#donuts');
    var elementsCharges = 0;
    var dureeMs = 5000;

  
    
    function animateStep(now, fx) {
      $chargementInfos.text(parseInt(now)+'%');
    }
    
    function chargementEnCours() {
      var pourcentage = 0;
      var value = 0;
      if($elements.length) {
        pourcentage = parseInt((elementsCharges / $elements.length) * 100);
      }
      
      // Affichage du pourcentage
      $chargementInfos
        .stop() // stop les anciennes animations
        .animate({width:pourcentage + '%'}, dureeMs);
      $chargement
        .stop() // stop les anciennes animations
        .animate({pourcentage:pourcentage}, {
          duration: dureeMs,
          step: animateStep
        });

        // setInterval(function bis(){ 
          $donuts.animate({borderSpacing:'+=360'}, {
            step: function(now) {
                $(this).css('-webkit-transform','rotate('+now+'deg)'); 
                  $(this).css('-moz-transform','rotate('+now+'deg)');
                  $(this).css('transform','rotate('+now+'deg)');
                $(this).css('-ms-transform','rotate('+now+'deg)');
                  $(this).css('-o-transform','rotate('+now+'deg)');
                  }, duration:5000, easing:'linear'    
          }); 
          // }, 10);       

    }
    
    function chargementTermine() {
      var pourcentage = 100;

      // Affichage du pourcentage
      $chargementInfos
        .stop() // stop les anciennes animations
        .animate({width:pourcentage + '%'}, (dureeMs / 2));
      $chargement
        .stop() // stop les anciennes animations
        .animate({pourcentage:pourcentage}, {
          duration: (dureeMs / 2),
          step: animateStep
        })
        // Disparition du chargement et affichage de la page
        .css({opacity: 1})
        .animate({opacity: 0}, function() {
          // La page est prete
          $chargement.css({display:'none'});
          $('#container')
            .css({
              opacity: 0,
              visibility:'visible'
            })
            .animate({opacity:1});
        });
      
        setInterval(function(){
        $('#container').fadeTo(800, 0.6).fadeTo(800, 1);  
          }, 10);
      
    }

    $('#home').on('click', 'a#enter', function(){      
      $('body,html').animate({
        scrollTop: $('#sections-menu').offset().top
      }, 1000);
      return false;
    }); 
    
    // La page contient des elements permettant d'afficher une barre de progression
    if($elements.length) {
      chargementEnCours();
      
      $elements.ready(function() {
        $(this).off('load');
        elementsCharges++;
        chargementEnCours();
      });
    }
    
    $(document).ready(function() {
      // La page est integralement chargee
      chargementTermine();

    });
    

    }

  });
  // Our module now returns our view
  return HomeView;
});

