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
  var AppRouter = Backbone.Router.extend({
    routes: {
        '':'home', // la home
        'audience': 'audience', // #audience 
        'audience/:season': 'audience/season', // #audience/season
        'characters':'characters', // #characters   
        'characters/:name':'characters/name', // #characters/name
        'facts':'facts', // #facts 
        'contribute':'contribute', // #contribute  
        'about':'about' // #about  
    },
    
  });

  var initialize = function(){
    var router = new AppRouter(); // création d'un routeur
    router.on('route:home', function(){ // effets home page
      // déclencheur de l'action
      var homeView =  new HomeView();
      homeView.render();
      console.log("On est sur la home page");
    });

    router.on('route:audience', function(){ // effets audience page
      // déclencheur de l'action
      var audienceView =  new AudienceView();
      audienceView.render();
      console.log("On est sur la audience page de toutes les saisons");
    });

    router.on('route:audience/seasons', function(season){ // effets audience page
      // déclencheur de l'action

      console.log("On est sur la audience page seasons numero "+season);
    });

    router.on('route:characters', function(){ // effets characters page
      // déclencheur de l'action
      var charactersView =  new CharactersView();
      charactersView.render();
      console.log("On est sur la page de tous les personnages");
    });

    router.on('route:characters/name', function(name){ // effets characters page
      // déclencheur de l'action
      var singleCharacterView =  new CharactersView();
      singleCharacterView.render();
      console.log("On est sur la page character de "+name);
    });

    router.on('route:facts', function(){ // effets facts page
      // déclencheur de l'action
      var factsView =  new FactsView();
      factsView.render();
      console.log("On est sur la facts page");
    });

    router.on('route:contribute', function(){ // effets contribute page
      // déclencheur de l'action
       var contributeView =  new ContributeView();
      contributeView.render();
      console.log("On est sur la contribute page");
    });

    router.on('route:about', function(){ // effets about page
      // déclencheur de l'action
      var aboutView =  new AboutView();
      aboutView.render();
      console.log("On est sur la page about");
    });

    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});