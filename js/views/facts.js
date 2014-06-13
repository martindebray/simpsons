// Filename: views/facts
define([
  'jquery',
  'underscore',
  'backbone',
  'd3',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!templates/facts.html'
], function($, _, Backbone, d3, factsTemplate){
  var FactsView = Backbone.View.extend({
    el: '.page',
    render: function(){
      
      // Using Underscore we can compile our template with data
      var data = {};
      var compiledTemplate = _.template( factsTemplate, data );
      // Append our compiled template to this Views "el"
      this.$el.html( compiledTemplate );
        $('body').scrollTop(0);
        $('#menu').removeClass('hidden');
        $('#factsButton').addClass('selected');
        $('#audienceButton').removeClass('selected');$('#charactersButton').removeClass('selected');$('#homeButton').removeClass('selected');$('#contributeButton').removeClass('selected');
        $('.page').fadeIn(300);
        // D3 ----------------------------------

        var svg = d3.select("#diagram")
          .append("svg")
          .append("g")

        // svg.append("g")
        //   .attr("class", "lines");

        var width = 140,
            height = 120,
          radius = Math.min($(window).width()/width*100, $(window).height()/height*100) / 2;7

        var circularBgT = svg.append("g")
            .append("circle")
            .attr("r", (radius*0.65)+20)
            .style("fill","rgba(255,255,255,0.6)");         

        var circularBg = svg.append("g")
            .append("circle")
            .attr("r", (radius*0.58)+20)
            .style("fill","rgba(255,255,255,1)");



        var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) {
            return d.number;
          });
          // Arc intérieur, parts
        var arc = d3.svg.arc()
          .outerRadius(radius * 0.65)
          .innerRadius(radius * 0.25);
          // Arc extérieur, légendes
        var outerArc = d3.svg.arc()
          .innerRadius(radius * 0.9)
          .outerRadius(radius * 0.9);

           // Positionnement
         svg.attr("transform", "translate(" + $(window).width()/width*100/3.1 + "," + $(window).height()/height*100/2.7+ ")")
            .attr("class","contenuDiagram");

        var i=0;
        getData(i);

        svg.append("g")
          .attr("class", "slices")
          .style("z-index","-1000");
        svg.append("g")
          .attr("class", "labels")
          .style("z-index","-1000");

        var firstData = 0;

        function getData(i){

        d3.json("json/dataFacts.json", function(error, data) {
        

        var totalFacts = 0;
          data.type[i].forEach(function(d) {
          
            d.number = +d.number;
            totalFacts = totalFacts+d.number; // calcul du total
          });

          $(".seasons").addClass("seasons-open");
          totalFact = 0;
          totalFact = totalFacts;
          firstData = data;

        // slices

          var slice = svg.select(".slices").selectAll("path.slice")
              .data(pie(data.type[i]));

          slice.enter()
              .insert("path")
              .attr("d", arc)
              .attr("shape-rendering","optimizeSpeed")
              .style("fill", function(d) { return color[d.data.season]; })
              .style("fill-opacity",0.7)
              .style("stroke","#464646")
              .style("z-index","1000")
              .style("cursor","pointer")
              .attr("class", "slice")
              .on("mouseover", function (d){d3.select(this).style("fill-opacity",1); return tooltip.style("visibility", "visible").text("Season "+d.data.season+" "+arrondisP(d.data.number)); }) //show label and title episode
              .on("mousemove", function (){ return tooltip.style("top",
                (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px"); })
              .on("mouseout", function (){ d3.select(this).style("fill-opacity",0.7); return tooltip.style("visibility", "hidden"); })
              .on("click", function(d){
                $("#introSeason").hide();
                $("#contentSeason").show();
            animateNumbers("#numberFacts",(d.data.number),750);animateNumbers("#season",(d.data.season),750);}); 

                  slice   
                    .transition().duration(1500)
                    .attrTween("d", function(d) {
                      this._current = this._current || d;
                      var interpolate = d3.interpolate(this._current, d);
                      this._current = interpolate(0);
                      return function(t) {
                        return arc(interpolate(t));
                      };
                    })

                  slice.exit()
                    .remove();

        // label

          // var text = svg.select(".labels").selectAll("text.label")
          //   .data(pie(data.type[i]));

          // text.enter()
          //     .append("text")
          //     .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
          //     .attr("dy", ".35em")
          //     .style("text-anchor", "middle")
          //     .style("font-size","14px")
          //     .style("cursor","pointer")
          //     .text(function(d) {             
          //       number = d.data.number/totalFacts*100;
          //       return number.toFixed(1)+"%"; })
          //     .style("fill", "#f7f7f7")
          //     .attr("class","label")
          //     .on("mouseover", function (d){ return tooltip.style("visibility", "visible").style("fill-opacity","0.5").text(function(e) {
               
          //       number = e.data.number/totalFacts*100;
          //       return number.toFixed(1)+"%"; }); }) //show label and title episode
          //     .on("mousemove", function (){ return tooltip.style("top",
          //       (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px"); })
          //     .on("mouseout", function (){ return tooltip.style("visibility", "hidden"); }) 
          //     .on("click", function(d){
          //   animateNumbers("#numberFacts",(d.data.number),750);$("#season").html(d.data.season);});  ;

             

          //               // Transition des textes --- changement des nombres

          // text.transition().duration(1500) // On ajoute pas de append on rajoute juste le nombre et sa position
          //     .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
          //     .attr("dy", ".35em")
          //     .style("text-anchor", "middle")
          //     .text(function(d) {
          //     var number =  d.data.season;
          //     number = d.data.number/totalFacts*100;
          //     return number.toFixed(1)+"%"; })
              
                 
          //         text.exit()
          //           .remove();

            function animateNumbers(el,number,d) {
                jQuery({someValue: 0}).animate({someValue: number}, {
                  duration: d,
                  easing:'swing', 
                  step: function() { 
                    $(el).text(Math.ceil(this.someValue));
                  }
                });
              }

            function arrondisP(nb){
              nb = nb/totalFact*100;
              return nb.toFixed(1)+"%";
            }

        // the label that is displaying the title of an episode when the mouse is over a dot (episode)
        var tooltip = d3.select("#facts")
          .append("div")
          .style("position", "absolute")
          .style("z-index", "1000")
          .style("background-color", "rgba(255,255,255,0.8)")
          .style("padding", "5px 10px")
          .style("font-size","12px")
          .style("font-family","arial")
          .style("visibility", "hidden")
          ;
            // On affiche le total
            animateNumbers("#number",(totalFacts),1000);




        });

     var color = ["#d1b270", "#66cff6", "#ec842e", "#de3831", "#6aade1", "#ffd90f", "#2c327e", "#0f8e44", "#d38bbc", "rgb(138, 124, 255)", "#563284", "#03664b", "#00af9e", "#930000", "rgb(164, 229, 112)","#d1b270", "#66cff6", "#ec842e", "#de3831", "#6aade1", "#ffd90f", "#2c327e", "#0f8e44", "#d38bbc", "#bcb4ff", "#563284", "#03664b", "#00af9e", "#930000", "#d5e6a7"]; // , "#ff8cFF", "#ff0000","#008c00","#ffAA00","#AA8c00","#ff8cAA","#AAFF00"
      //var color = ["#f1c40f", "#f39c12", "#e67e22", "#d35400", "#e74c3c", "#c0392b", "#9b59b6", "#8e44ad", "#3498db", "#2980b9", "#2ecc71", "#16a085", "#f1c40f", "#f39c12", "#e67e22", "#d35400", "#e74c3c", "#c0392b", "#9b59b6", "#8e44ad", "#3498db", "#2980b9", "#2ecc71", "#16a085"]; 
    // var color = ["#AD646A", "#B06A6F", "#B37075", "#B6767B", "#BA7C81", "#BD8387", "#C0898D", "#C38F93","#C79599", "#CA9B9F", "#CDA2A5", "#D1A8AB", "#D4AEB1", "#D7B4B7", "#DABABD", "#DEC1C3", "#E1C7C9", "#E4CDCF","#E8D3D5", "#EBD9DB", "#EEE0E1", "#F1E6E7", "#F5ECED", "#F8F2F3"]; 
     // var color = ["#fddadc", "#afe2eb", "#f39967", "#5abeeb", "#e6a45f", "#d57bbb", "#64d0b4", "#e4b1da","#d8d1e5", "#b7c9d8", "#6fc9c7", "#d57bbb", "#91c4d5", "#f6926f", "#e6a560","#fddadc", "#afe2eb", "#f39967", "#5abeeb", "#e6a45f", "#d57bbb", "#64d0b4", "#e4b1da","#d8d1e5", "#b7c9d8"]; 

    }

var Facts = ["homer says doh", "Itchy & Scratchy appear", "Homer strangles Bart", "Bart prank calls", "Church marquees appear", "Moleman (almost) dies"];
var imgFacts =["doh.png","Itchy-Scratchy.png","Homer-Struggle.png", "Moe-Prank.png", "Church-message.png", "hans.png"];

$("#contentSeason").hide();

// au click de next
        d3.select("#next")
          .on("click", function(){
            if(i==Facts.length-1){
              i=0;
            } else {
              i++;
            }   
            getData(i);
                   
            $(".title").fadeOut(750,function() {
                $(this).html(Facts[i]).fadeIn(750);
            });

            $("#introSeason").hide();
            $("#contentSeason").fadeOut(function() {
                 $("#typeFacts").html(Facts[i]);
                 $("#numberFacts").html(firstData.type[i][0].number);
                 $("#season").html(firstData.type[i][0].season);

                $(this).fadeIn();
            });

            $("#myPicture").fadeOut(750,function() {
                $(this).attr("src","img/facts/"+imgFacts[i]);
                $(this).fadeIn(750);
            });
         
           


          });
// au click de prec
        d3.select("#prec")
          .on("click", function(){
            if(i==0){
              i=Facts.length-1;
            } else {
              i=i-1;
            }               
            getData(i);

            $(".title").fadeOut(function() {
                $(this).html(Facts[i]).fadeIn();
            });

            $("#introSeason").hide();
            $("#contentSeason").fadeOut(function() {
                 $("#typeFacts").html(Facts[i]);
                 $("#numberFacts").html(firstData.type[i][0].number);
                 $("#season").html(firstData.type[i][0].season);

                $(this).fadeIn();
            });

            $("#myPicture").fadeOut(200,function() {
                $(this).attr("src","img/facts/"+imgFacts[i]).fadeIn();
            });

          });

          
         
           //            $(".slices").hover(function(){     $(".slices").addClass(".poulet");       //$(this).style("fill","black")
           // });

            }
          });
  // Our module now returns our view
  return FactsView;
});