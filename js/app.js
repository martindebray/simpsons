// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
  'd3',
  'router', // Request router.js
], function($, _, Backbone, d3, Router){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
    Router.initialize();
  }

  return {
    initialize: initialize
  };
});