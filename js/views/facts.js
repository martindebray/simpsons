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
          radius = Math.min($(window).width()/width*100, $(window).height()/height*100) / 2;

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
         svg.attr("transform", "translate(" + $(window).width()/width*100/3 + "," + $(window).height()/height*100/3+ ")")
            .attr("class","contenuDiagram");

        var i=0;
        getData(i);

        svg.append("g")
          .attr("class", "slices")
          .style("z-index","-1000");
        svg.append("g")
          .attr("class", "labels")
          .style("z-index","-1000");

        function getData(i){

        d3.json("json/dataFacts.json", function(error, data) {
        

        var totalFacts = 0;
          data.type[i].forEach(function(d) {
          
            d.number = +d.number;
            totalFacts = totalFacts+d.number; // calcul du total
          });

        // slices

          var slice = svg.select(".slices").selectAll("path.slice")
              .data(pie(data.type[i]));

          slice.enter()
              .insert("path")
              .attr("d", arc)
              .style("fill", function(d) { return color[d.data.season]; })
              .style("stroke","white")
              .style("z-index","1000")
              .attr("class", "slice")
              .on("mouseover", function (d){ d3.select(this).style("fill-opacity",0.6); return tooltip.style("visibility", "visible").style("fill-opacity","0.5").text("Saison "+d.data.season+" : "+d.data.number); }) //show label and title episode
              .on("mousemove", function (){ return tooltip.style("top",
                (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px"); })
              .on("mouseout", function (){ d3.select(this).style("fill-opacity",1); return tooltip.style("visibility", "hidden"); }); 

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

          var text = svg.select(".labels").selectAll("text.label")
            .data(pie(data.type[i]));

          text.enter()
              .append("text")
              .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
              .attr("dy", ".35em")
              .style("text-anchor", "middle")
              .style("font-size","14px")
              .style("cursor","default")
              .text(function(d) {
                var number =  d.data.season;
                number = d.data.number/totalFacts*100;
                return number.toFixed(1)+"%"; })
              .style("fill", "#f7f7f7")
              .attr("class","label")
                            .on("mouseover", function (d){ return tooltip.style("visibility", "visible").style("fill-opacity","0.5").text("Saison "+d.data.season+" : "+d.data.number); }) //show label and title episode
              .on("mousemove", function (){ return tooltip.style("top",
                (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px"); })
              .on("mouseout", function (){ return tooltip.style("visibility", "hidden"); }); ;

             

                        // Transition des textes --- changement des nombres

          text.transition().duration(1500) // On ajoute pas de append on rajoute juste le nombre et sa position
              .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
              .attr("dy", ".35em")
              .style("text-anchor", "middle")
              .text(function(d) {
              var number =  d.data.season;
              number = d.data.number/totalFacts*100;
              return number.toFixed(1)+"%"; })
              
                 
                  text.exit()
                    .remove();

            function animateNumbers(el,number) {
                jQuery({someValue: 0}).animate({someValue: number}, {
                  duration: 1000,
                  easing:'swing', 
                  step: function() { 
                    $(el).text(Math.ceil(this.someValue));
                  }
                });
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
          .style("visibility", "hidden");
            // On affiche le total
            animateNumbers("#number",(totalFacts));



        });
                var color = ["#d1b270", "#66cff6", "#ec842e", "#de3831", "#6aade1", "#ffd90f", "#2c327e", "#0f8e44", "#d38bbc", "#bcb4ff", "#563284", "#03664b", "#00af9e", "#930000", "#d5e6a7"]; // , "#ff8cFF", "#ff0000","#008c00","#ffAA00","#AA8c00","#ff8cAA","#AAFF00"
        }

var Facts = ["homer said doh", "Itchy and Scratchy appear", "Homer strangles Bart", "Bart phone's prank", "Presence of Church", "Moleman close to death"];
var imgFacts =["doh.png","Itchy-Scratchy.png","Homer-Struggle.png", "Moe-Prank.png", "Church-message.png", ""];
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