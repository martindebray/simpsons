// Filename: views/about
define([
  'jquery',
  'underscore',
  'backbone',
  'd3',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!templates/about.html'
], function($, _, Backbone, d3, aboutTemplate){
  var AboutView = Backbone.View.extend({
    el: '.page',
    render: function(){
      // Using Underscore we can compile our template with data
      var data = {};
      var compiledTemplate = _.template( aboutTemplate, data );
      // Append our compiled template to this Views "el"
      this.$el.html( compiledTemplate );
        $('#menu').removeClass('hidden');
        $('#contributeButton').removeClass('selected');
        $('#audienceButton').removeClass('selected');$('#charactersButton').removeClass('selected');$('#homeButton').removeClass('selected');$('#factsButton').removeClass('selected');
    }
  });
  // Our module now returns our view
  return AboutView;
});