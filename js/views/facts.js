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

        d3.json("json/facts.json", function(error, data) {
        console.log(data.type[0][0].number);

        var totalFacts = 0;
          data.type[i].forEach(function(d) {
            console.log(d.number);
            d.number = +d.number;
            totalFacts = totalFacts+d.number; // calcul du total
          });

        // slices

          var slice = svg.select(".slices").selectAll("path.slice")
              .data(pie(data.type[i]));

          slice.enter()
              .insert("path")
              .attr("d", arc)
              .style("fill", function(d) { return color(d.data.season); })
              .style("stroke","white")
              .style("z-index","1000")
              .attr("class", "slice");

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
              .text(function(d) {
                var number =  d.data.season;
                number = d.data.number/totalFacts*100;
                return number.toFixed(1)+"%"; })
              .style("fill", "#f7f7f7")
              .attr("class","label");

             

                        // Transition des textes --- changement des nombres

          text.transition().duration(1500) // On ajoute pas de append on rajoute juste le nombre et sa position
              .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
              .attr("dy", ".35em")
              .style("text-anchor", "middle")
              .text(function(d) {
              var number =  d.data.season;
              number = d.data.number/totalFacts*100;
              return number.toFixed(1)+"%"; })
              .style("fill", "#f7f7f7");
                 
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

            // On affiche le total
            animateNumbers("#number",(totalFacts));



        });
                var color = d3.scale.ordinal()
                  //.domain([0.1, 0.4, 0.5, 0.51, 0.52, 0.53, 0.54]) //, 0.55, 0.56, 0.57, 0.58, 0.59, 0.65, 0.64, 0.63
                  .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]); // , "#ff8cFF", "#ff0000","#008c00","#ffAA00","#AA8c00","#ff8cAA","#AAFF00"
        }

var Facts = ["homer said doh", "Itchy and Scratchy appear", "Bart's prank", "Strangle", "Abraham's story"];
// au click de next
        d3.select("#next")
          .on("click", function(){
            if(i==Facts.length-1){
              i=0;
            } else {
              i++;
            }   
            getData(i);
            $(".title").html(Facts[i]);
           

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
            $(".title").html(Facts[i]);

          });

          
         
           //            $(".slices").hover(function(){     $(".slices").addClass(".poulet");       //$(this).style("fill","black")
           // });

            }
          });
  // Our module now returns our view
  return FactsView;
});