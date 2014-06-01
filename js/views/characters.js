// Filename: views/characters
define([
  'jquery',
  'underscore',
  'backbone',
  'd3',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!templates/characters.html'
], function($, _, Backbone, d3, charactersTemplate){
  var CharactersView = Backbone.View.extend({
    el: '.page',
    render: function(){
      // Using Underscore we can compile our template with data
      var data = {};
      var compiledTemplate = _.template( charactersTemplate, data );
      // Append our compiled template to this Views "el"
      this.$el.html( compiledTemplate );
        $('#menu').removeClass('hidden');
        $('#charactersButton').addClass('selected');
        $('#factsButton').removeClass('selected');$('#audienceButton').removeClass('selected');$('#homeButton').removeClass('selected');$('#contributeButton').removeClass('selected');

          // -----------------------------List of the characters -----------------------------
          
          $.getJSON( "json/characters.json", function( data ) {
            for(var i=0; i<data.length; i++){
              $("#display-character-list").append('<a href="'+data[i].name+'" class="change-character" data-character="'+data[i].name+'"><img src="img/characters/'+data[i].name+'.svg" /><span>'+data[i].name+'</span></a>');
            }

            for(var i=0; i<data.length; i++){
              $("#display-relatives").append('<a href="'+data[i].name+'" class="change-character" data-character="'+data[i].name+'"><img src="img/characters/'+data[i].name+'.svg" /><span>'+data[i].name+'</span></a>');
            }

          });

          $("#open-list").click(function(e){
            e.preventDefault();
            $("#characters-list").toggleClass("list-opened");
            // if($("#open-list").text == "All characters"){ $("##open-list").text = "Back"} else {$("##open-list").text = "All characters"}
          })

          // ----------------------------------D3---------------------------------------------
          var ep_data; // a global variable for the data of all episode of all seasons
          var character_data; // a global variable for the data of all episode of all seasons
          var index = 0;
          var g;
          var svg;
          var img;

          // get episode data
          d3.json("json/episodes.json", function(error, json) {
            if (error) return console.warn(error);
            ep_data = json;
            visualizeit();
          });


          // get character data
          d3.json("json/characters.json", function(error, json) {
            if (error) return console.warn(error);
            character_data = json;
            displayInformation(index);
          });

          // display the character's information
          function displayInformation(index) {
            $("#character-name").text(character_data[index].name);
            $("#character-catchphrase span").text(character_data[index].name);
            $("#character-app-number span span").text(character_data[index].appearances.length);
            firstApp(character_data[index].appearances[0]);
          }

          
          // find the episode by its number
          function firstApp(i) {
            i = i-1;
            var title ="";
            $.getJSON( "json/episodes.json", function( data ) {
              for (var a=0; a<data.seasons.length; a++) {
                for (var j=0; j<data.seasons[a].length; j++) {
                    if (i == data.seasons[a][j].number){
                      $("#character-first-app span").text(data.seasons[a][i].title);
                    }
                }
              }
            });
          }


          // display all the episodes on the graph
          function visualizeit(){
            
            //create svg container
            svg = d3.select(".page").append("svg:svg")
                .attr("width", "80%")
                .attr("height", "60%")
                .append("svg:g")
                .attr("transform", "translate(550, 420)");
           
            // bars (rays) attributes
            var barSpacing = d3.scale.linear().domain([0, 9]).range([80, 170]); // domain = à peu près espacement des points &&& range = en gros le rayon de l'intérieur de l'arc                            
            var rotation = d3.range(183, 363, 7.2); // rotation rayon par rayon de l'angle 183 à 363 avec un pas de 7,2 (= 180 / 25 rayons)

            //add character's image
            img = svg.append("image")
              .attr("width", 310)
              .attr("height", 310)
              .attr("x", -155)
              .attr("y", -155)
              .attr("xlink:href","img/characters/"+character_data[0].name+".svg");

            // create a ray per season
            g = svg.selectAll("g")
                .data(ep_data.seasons)
                .enter().append("svg:g")
                .attr("transform", function(d,i) { return "rotate(" + rotation[i] + ")"; });

            // create dots for each episode on the rays
            var circle = g.selectAll("circle")
                .data(function(d, i, j) { return d; }) // on attache les données des apparitions par ep
                .enter().append("svg:circle")
                .attr("cx", function (d,i){return barSpacing(i); } ) 
                .attr("r", function (d,j){ if(checkAppearances(d,j)==true){ return 4.5 } else { return 2.5 } }) 
                .attr("fill", function (d,j) { if(checkAppearances(d,j)==true){ return "red" } else { return "#777" } }) 
                .on("mouseover", function (d,i){ return tooltip.style("visibility", "visible").text("Episode "+d.episode+" : "+d.title); }) //show label and title episode
                .on("mousemove", function (){ return tooltip.style("top",
                    (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px"); })
                .on("mouseout", function (){ return tooltip.style("visibility", "hidden"); }); 
                

            // label the different rays with season number
            var text = g.append("svg:text");
            var textLabels = text
                          .attr("x", 330)
                          .attr("y", 0)
                          .text(function(d,i){return "Season "+ (i+1)})
                          .attr("font-family", "sans-serif")
                          .attr("font-size", "12px")
                          .attr("fill", "red");

            // the label that is displaying the title of an episode when the mouse is over a dot (episode)
            var tooltip = d3.select("body")
              .append("div")
              .style("position", "absolute")
              .style("z-index", "10")
              .style("background-color", "rgba(255,255,255,0.8)")
              .style("padding", "5px 10px")
              .style("font-size","12px")
              .style("font-family","arial")
              .style("visibility", "hidden");


          } //end visualizeit

          function checkAppearances(d,j) { 
            for (var i=0; i<(character_data[index].appearances).length; i++){
              if(d.number==character_data[index].appearances[i]){ 
                return true;
              } 
            }
          }

          function findIndexOf(json, name){
            for (var i=0; i<json.length; i++){
              if(json[i].name== name){
                return i;
              }
            } 
          }

          //Update the data on the graph
          $(".page").on("click","a.change-character",function () {
            $("#characters-list").removeClass("list-opened");
            event.preventDefault();
            var selected = $(this).attr('data-character');
            console.log(selected);

            index = findIndexOf(character_data, selected);
            displayInformation(index);

            circle = g.selectAll("circle")
                .data(function(d, i, j) { return d; }) // on attache les données des apparitions par ep
                .transition().duration(750)
                .delay(100)
                .attr("r", function (d,j){ if(checkAppearances(d,j)==true){ return 4.5 } else { return 2.5 } }) 
                .attr("fill", function (d,j) { if(checkAppearances(d,j)==true){ return "red" } else { return "#777" } }) ;

            img = svg.selectAll("image")
              .data(character_data[0].name)
              .transition().duration(750)
              .delay(100)
              .attr("xlink:href","img/characters/"+selected+".svg");

          });

      }
  });
  // Our module now returns our view
  return CharactersView;
});