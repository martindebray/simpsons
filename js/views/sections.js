// Filename: views/home
define([
  'jquery',
  'underscore',
  'backbone',
  'd3',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!templates/sections.html'
], function($, _, Backbone, d3, sectionsTemplate){
  var SectionsView = Backbone.View.extend({
    el: '.page',
    render: function(){
      // Using Underscore we can compile our template with data
      var data = {};
      var compiledTemplate = _.template( sectionsTemplate, data );
      // Append our compiled template to this Views "el"
      this.$el.html( compiledTemplate );
        $('#menu').addClass('hidden');
        $('#homeButton').addClass('selected');
        $('#audienceButton').removeClass('selected');$('#charactersButton').removeClass('selected');$('#factsButton').removeClass('selected');$('#contributeButton').removeClass('selected');
    
    
    

    }

  });
  // Our module now returns our view
  return SectionsView;
});

