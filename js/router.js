// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'd3',
  'views/home',
  'views/audience',
  'views/characters',
  'views/facts',
  'views/contribute',
  'views/about'   
], function($, _, Backbone, d3, HomeView, AudienceView, CharactersView, FactsView, ContributeView, AboutView){
  _this = this;
  var AppRouter = Backbone.Router.extend({
    routes: {
        '':'home', // la home
        'sections':'sections', // choix des sections
        'reviews': 'reviews', // #audience 
        'audience/:season': 'audience/season', // #audience/season
        'characters':'characters', // #characters   
        'characters/:name':'characters/name', // #characters/name
        'facts':'facts', // #facts 
        'contribute':'contribute', // #contribute  
        'about':'about' // #about  
    }
    
  });

  var initialize = function(){
    var router = new AppRouter(); // création d'un routeur
    router.on('route:home', function(){ // effets home page
      // déclencheur de l'action
      $('.page').fadeOut(300, function() {
        var homeView =  new HomeView();
        homeView.render();
      });
    });

    router.on('route:reviews', function(){ // effets audience page
      // déclencheur de l'action
      $('.page').fadeOut(300, function() {
        var audienceView =  new AudienceView();
        audienceView.render();
      });
    });

    router.on('route:audience/seasons', function(season){ // effets audience page
      // déclencheur de l'action

      
    });

    router.on('route:characters', function(){ // effets characters page
      // déclencheur de l'action
      $('.page').fadeOut(300, function() {
        var charactersView =  new CharactersView();
        charactersView.render();
      });
    });

    router.on('route:characters/name', function(name){ // effets characters page
      // déclencheur de l'action
      var singleCharacterView =  new CharactersView();
      singleCharacterView.render();
    });

    router.on('route:facts', function(){ // effets facts page
      // déclencheur de l'action
      $('.page').fadeOut(300, function() {
        var factsView =  new FactsView();
        factsView.render();
      });
    });

    router.on('route:contribute', function(){ // effets contribute page
      // déclencheur de l'action
      $('.page').fadeOut(300, function() {
        var contributeView =  new ContributeView();
        contributeView.render();
      });
    });

    router.on('route:about', function(){ // effets about page
      // déclencheur de l'action
      $('.page').fadeOut(300, function() {
        var aboutView =  new AboutView();
        aboutView.render();
      });
    });

    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});