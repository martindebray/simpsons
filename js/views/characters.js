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
      var _this = this;

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
              $("#display-character-list div").append('<a href="#/characters/'+data[i].name+'" class="change-character" data-character="'+data[i].name+'"><img src="img/characters/'+data[i].name+'.svg" /><span>'+data[i].name+'</span></a>');
            }

            // for(var i=0; i<data.length; i++){
            //   $("#display-relatives div").append('<a href="#/characters/'+data[i].name+'" class="change-character" data-character="'+data[i].name+'"><img src="img/characters/'+data[i].name+'.svg" /><span>'+data[i].name+'</span></a>');
            // }

          });


          $("#open-list").click(function(e){
            e.preventDefault();
            $("#characters-list").toggleClass("list-opened");
            // $('#display-character-list a').css("opacity","0");
            // if($("#characters-list").hasClass("list-opened")) {
            //   $('#display-character-list a').each(function(i) {
            //     $(this).delay((i++) * 150).fadeTo(400, 1); 
            //     // $("#open-list").click(function(){
            //     //   console.log("clicked");
            //     //   return false;
            //     //   });
            //   });
            // } else {
            //   $('#display-character-list a').css("opacity","0");
            // }
            $(this).text(function(i, text){
                return text === "List of all the characters" ? "Close the list" : "List of all the characters";
            })
            
          })

          // ----------------------------------D3---------------------------------------------
          this.ep_data = null; // a global variable for the data of all episode of all seasons
          this.character_data = null; // a global variable for the data of all episode of all seasons
          this.index = 0;
          var g;
          var svg;
          var img;


          // get character data
          d3.json("json/characters.json", function(error, json) {
            if (error) return console.warn(error);
            character_data = json;
            var currentCharName = Backbone.history.fragment.substring(11);
            if(currentCharName) { 
              index = _this.findIndexOf(character_data, currentCharName); 
            } else { 
              index = 20 
            }
            _this.displayInformation(index);

            // get episode data
            d3.json("json/episodes.json", function(error, json) {
              if (error) return console.warn(error);
              ep_data = json;
              _this.visualizeit();
            });

          });

      },
      // display all the episodes on the graph
      visualizeit: function(){
        var _this = this;
        
        //create svg container
        svg = d3.select("#character-graph")
            .append("svg:g")
            .attr("transform", "translate(455, 400)");
       
        // bars (rays) attributes
        var barSpacing = d3.scale.linear().domain([0, 8.5]).range([80, 170]); // domain = à peu près espacement des points &&& range = en gros le rayon de l'intérieur de l'arc                            
        var rotation = d3.range(183, 363, 7.2); // rotation rayon par rayon de l'angle 183 à 363 avec un pas de 7,2 (= 180 / 25 rayons)

        //add character's image
        img = svg.append("image")
          .attr("width", 140)
          .attr("height", 140)
          .attr("x", -70)
          .attr("y", -70)
          .attr("xlink:href","img/characters/"+character_data[index].name+".svg")
          .style("opacity","0");

        img.transition()
          .duration(800)
          .delay(300)
          .style("opacity","1");

        // create a ray per season
        g = svg.selectAll("g")
            .data(ep_data.seasons)
            .enter().append("svg:g")
            .attr("transform", function(d,i) { return "rotate(0)"; })
            .style("opacity","0");

        g.transition()
          .duration(800)
          .delay(100)
          .attr("transform", function(d,i) { return "rotate(" + rotation[i] + ")"; })
          .style("opacity","1");

        // create dots for each episode on the rays
        var circle = g.selectAll("circle")
            .data(function(d, i, j) { return d; }) // on attache les données des apparitions par ep
            .enter().append("svg:circle")
            .attr("cx", function (d,i){return barSpacing(i); } ) 
            .attr("r", 0) 
            .attr("fill", function (d,j) { if(_this.checkAppearances(d,j)==true){ return "#003e63" } else { return "#cee7f5" } }) 
            .on("mouseover", function (d,i){ return tooltip.style("visibility", "visible").text("Episode "+d.episode+" : "+d.title); }) //show label and title episode
            .on("mousemove", function (){ return tooltip.style("top",
                (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px"); })
            .on("mouseout", function (){ return tooltip.style("visibility", "hidden"); }); 
            
            circle.transition()
              .duration(500)
              .delay(100) 
              .attr("r", function (d,j){ if(_this.checkAppearances(d,j)==true){ return 4.5 } else { return 2.5 } });

        // label the different rays with season number
        var text = g.append("svg:text");
        var textLabels = text
                      .attr("x", function(d,i){if(i<13) { return -375 } else { return 350 } })
                      .attr("y", function(d,i){if(i<13) { return 5 } else { return 0 } })
                      .text(function(d,i){if(i<9) { return "S0"+ (i+1) } else { return "S"+ (i+1)} })
                      .attr("font-family", "Arial")
                      .style("text-transform", "uppercase")
                      .attr("font-size", "12px")
                      .attr("fill", "#fff")
                      .attr("transform", function(d,i){if(i<13) { return "rotate(-180)" } else { return "rotate(0)" } });

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


      }, //end visualizeit
      checkAppearances: function(d,j) { 
        for (var i=0; i<(character_data[index].appearances).length; i++){
          if(d.number==character_data[index].appearances[i]){ 
            return true;
          } 
        }
      },
      findIndexOf: function(json, name){
        for (var i=0; i<json.length; i++){
          if(json[i].name== name){
            return i;
          }
        } 
      },
      // display the character's information
      displayInformation: function(index) {
        console.log("HEY");
        $("#character-info").addClass("character-info-open");
        $("#character-name-wrapper").fadeIn(1500);
        $("#character-name").text(character_data[index].name);
        $("#character-catchphrase span").text('"'+character_data[index].catchphrase+'"');
        this.animateNumbers("#character-app-number span span",character_data[index].appearances.length);
        this.firstApp(character_data[index].appearances[0]);
      },
      animateNumbers: function(el,number) {
        jQuery({someValue: 0}).animate({someValue: number}, {
          duration: 2000,
          easing:'swing', 
          step: function() { 
            $(el).text(Math.ceil(this.someValue));
          }
        });
      },
      // find the episode's title of the first appearance by its number
      firstApp: function(i) {
        i = i;
        var title ="";
        $.getJSON( "json/episodes.json", function( data ) {
          for (var a=0; a<data.seasons.length; a++) {
            for (var j=0; j<data.seasons[a].length; j++) {
                if (i == data.seasons[a][j].number){
                  $("#character-first-app span").text('"'+data.seasons[a][j].title+'"');
                }
            }
          }
        });
      }

  });
  // Our module now returns our view
  return CharactersView;
});