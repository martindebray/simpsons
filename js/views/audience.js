// Filename: views/audience
define([
  'jquery',
  'underscore',
  'backbone',
  'd3',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!templates/audience.html'
], function($, _, Backbone, d3, audienceTemplate){
  var AudienceView = Backbone.View.extend({
    el: '.page',
    render: function(){
      // Using Underscore we can compile our template with data
      var data = {};
      var compiledTemplate = _.template( audienceTemplate, data );
      // Append our compiled template to this Views "el"
      this.$el.html( compiledTemplate );
        $('#menu').removeClass('hidden');
        $('#audienceButton').addClass('selected');
        $('#factsButton').removeClass('selected');$('#charactersButton').removeClass('selected');$('#homeButton').removeClass('selected');$('#contributeButton').removeClass('selected');
         // ----------------------------------------D3 AUDIENCE---------------------------------------------
        var ep_data; // a global variable for the data of all episode of all seasons

          // get episode data
          d3.json("json/episodes.json", function(error, json) {
            if (error) return console.warn(error)
            ep_data = json;
            visualizeme();
          });  

         // display all the episodes on the graph
        function visualizeme(){

    /*
//RANDOMLY RATE EVERY EPISODE
    for (var i = 0; i < ep_data.seasons.length; ++i){
                for (var j = 0; j < ep_data.seasons[i].length; ++j){
                    //console.log(ep_data.seasons[i][j])
                    ep_data.seasons[i][j].rate=Math.floor((Math.random()*10));
                };
        };
*/

    //RANDOMLY RATE EVERY SEASON
    for (var i = 0; i < ep_data.seasons.length; ++i){
                    ep_data.seasons[i].rate=Math.floor(3+(Math.random()*6));
        };

       

          //Width and height
            var w = 800;
            var h = 500;
            var padding=20;
            //scale
            var scaleX = d3.scale.linear().domain([0, 24]).range([padding, w-padding]);
            var scaleY = d3.scale.linear().domain([0, 10]).range([padding, h-padding]);
            
            //axes
            var xAxis = d3.svg.axis()
                  .scale(scaleX)
                  .orient("bottom")
                  ;
                  
            var yAxis = d3.svg.axis()
                    .scale(scaleY)
                    .orient("left")
                    ;
            
            //Create SVG element
            var svg = d3.select(".page")
                        .append("svg:svg")
                        .attr("width", w)
                        .attr("height", h)
                        .style("background-color","#2a4a7c")
                        

            svg.selectAll("circle")
               .data(ep_data.seasons)
               .enter()
               .append("circle")
               .attr("fill","white" )
               .attr("stroke","#75c0e5")
               .attr("stroke-width",2)
               .attr("r", 5)
               .attr("cx", function(d,i){return scaleX(i); } )
               .attr("cy", function(d,i){return scaleY(ep_data.seasons[i].rate)})
               .on("mouseover", function(d,i){console.log(
               ", rate : "+ep_data.seasons[i].rate
               )})
               ;
            
            //Create X axis
            svg.append("g")
            .attr("class", "axis xAxis")  //Assign "axis" class
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis);
            
            svg.append("g")
            .attr("class", "axis yAxis")  //Assign "axis" class
            .attr("transform", "translate("+(padding) +",0)")
            .call(yAxis);
            
            var lineFunction = d3.svg.line()
                          .x(function(d,i) { return scaleX(i) })
                          .y(function(d,i) { return scaleY(ep_data.seasons[i].rate)})
                          .interpolate("linear");
                          
             svg.append("path")
                            .attr("d", lineFunction(ep_data.seasons))
                            .attr("stroke", "white")
                            .attr("stroke-width", 2)
                            .attr("fill", "none"); 
            
            //console.log(ep_data);//Les 25 saisons (copie du json)
            //console.log(ep_data.seasons); //Les 25 saisons - un tableau par saison
            //console.log(ep_data.seasons[0]);//Données des x épisodes de la saison 0
            //console.log(ep_data.seasons[0][0]);//Données de l'épisode 0 de la saison 0
            //console.log("Code de production : "+ep_data.seasons[0][0].productioncode);
            
               
        } //end visualizeit
        // -----------------------------------FIN D3 AUDIENCE--------------------------------------------
      }
  });
  // Our module now returns our view
  return AudienceView;
});