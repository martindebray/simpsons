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
        $('#menu').removeClass('hidden');
        $('#factsButton').addClass('selected');
        $('#audienceButton').removeClass('selected');$('#charactersButton').removeClass('selected');$('#homeButton').removeClass('selected');$('#contributeButton').removeClass('selected');
   
        // D3 ----------------------------------

        var svg = d3.select("#diagram")
          .append("svg")
          .append("g")

        // svg.append("g")
        //   .attr("class", "lines");

        var width = 960,
            height = 450,
          radius = Math.min(width, height) / 2;

        var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) {
            return d.number;
          });
          // Arc intérieur, parts
        var arc = d3.svg.arc()
          .outerRadius(radius * 0.8)
          .innerRadius(radius * 0.3);
          // Arc extérieur, légendes
        var outerArc = d3.svg.arc()
          .innerRadius(radius * 0.9)
          .outerRadius(radius * 0.9);

          // Positionnement
        svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var key = function(d){ return d.data.label; };
var i=0;
getData(i);
        svg.append("g")
          .attr("class", "slices");
        svg.append("g")
          .attr("class", "labels");

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
      .attr("class", "slice");

          slice   
            .transition().duration(1000)
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
      .text(function(d) {
        d.data.season = d.data.number/totalFacts*100;
        return d.data.season.toFixed(1)+"%"; });

                // Transition des textes        
          function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
          }

          text.transition().duration(1000)
              
            //.attrTween("dy",textTweenX).attrTween("dy",textTweenY)
            // .attrTween("transform", function(d) {
            //   this._current = this._current || d;
            //   var interpolate = d3.interpolate(this._current, d);
            //   this._current = interpolate(0);
            //   return function(t) {
            //     var d2 = interpolate(t);
            //     var pos = outerArc.centroid(d2);
            //     pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
            //     return "translate("+ pos +")";
            //   };
            // })
            // .styleTween("text-anchor", function(d){
            //   this._current = this._current || d;
            //   var interpolate = d3.interpolate(this._current, d);
            //   this._current = interpolate(0);
            //   return function(t) {
            //     var d2 = interpolate(t);
            //     return midAngle(d2) < Math.PI ? "start":"end";
            //   };
            // });
                function textTweenX(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) { return 0.6*rx*Math.cos(0.5*(i(t).startAngle+i(t).endAngle));  };
    }
    function textTweenY(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) { return 0.6*rx*Math.sin(0.5*(i(t).startAngle+i(t).endAngle));  };
    }
          text.exit()
            .remove();

});
        var color = d3.scale.ordinal()
          //.domain([0.1, 0.4, 0.5, 0.51, 0.52, 0.53, 0.54]) //, 0.55, 0.56, 0.57, 0.58, 0.59, 0.65, 0.64, 0.63
          .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]); // , "#ff8cFF", "#ff0000","#008c00","#ffAA00","#AA8c00","#ff8cAA","#AAFF00"
}
//-------------
//console.log(color.domain()[0]);
  var color = d3.scale.ordinal()
          //.domain([0.1, 0.4, 0.5, 0.51, 0.52, 0.53, 0.54]) //, 0.55, 0.56, 0.57, 0.58, 0.59, 0.65, 0.64, 0.63
          .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]); // , "#ff8cFF", "#ff0000","#008c00","#ffAA00","#AA8c00","#ff8cAA","#AAFF00"
        function randomData (){
          var labels = color.domain();
          return labels.map(function(label){
            return { label: label, value: Math.random() }
          });
        }

        change(randomData());
// au click
        d3.select(".next")
          .on("click", function(){
            //change(randomData());
            i++;
            getData(i);
            console.log("click");

          });

        d3.select(".prec")
          .on("click", function(){
            //change(randomData());
            i=i-1;
            getData(i);
            console.log("click");

          });


        function change(data) {

          /* ------- PIE SLICES -------*/
          // A l'update de données
          var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data), key);

          slice.enter()
            .insert("path")
            .style("fill", function(d) { return color(d.data.label); })
            .attr("class", "slice");
            // Transition des pie slices
          slice   
            .transition().duration(1000)
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

          /* ------- TEXT LABELS -------*/
          // à l'update de données
          // var text = svg.select(".labels").selectAll("text")
          //   .data(pie(data), key);

         //  text.enter()
         //    .append("text")
         //    .attr("dy", ".35em")
         //    .text(function(d) {
         //      return d.data.label;
         //    });
         // // Transition des textes        
         //  function midAngle(d){
         //    return d.startAngle + (d.endAngle - d.startAngle)/2;
         //  }

         //  text.transition().duration(1000)
         //    .attrTween("transform", function(d) {
         //      this._current = this._current || d;
         //      var interpolate = d3.interpolate(this._current, d);
         //      this._current = interpolate(0);
         //      return function(t) {
         //        var d2 = interpolate(t);
         //        var pos = outerArc.centroid(d2);
         //        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
         //        return "translate("+ pos +")";
         //      };
         //    })
         //    .styleTween("text-anchor", function(d){
         //      this._current = this._current || d;
         //      var interpolate = d3.interpolate(this._current, d);
         //      this._current = interpolate(0);
         //      return function(t) {
         //        var d2 = interpolate(t);
         //        return midAngle(d2) < Math.PI ? "start":"end";
         //      };
         //    });


         //  text.exit()
         //    .remove();

          /* ------- SLICE TO TEXT POLYLINES -------*/
// transition des polylines
          // var polyline = svg.select(".lines").selectAll("polyline")
          //   .data(pie(data), key);
          
          // polyline.enter()
          //   .append("polyline");

          // polyline.transition().duration(1000)
          //   .attrTween("points", function(d){
          //     this._current = this._current || d;
          //     var interpolate = d3.interpolate(this._current, d);
          //     this._current = interpolate(0);
          //     return function(t) {
          //       var d2 = interpolate(t);
          //       var pos = outerArc.centroid(d2);
          //       pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          //       return [arc.centroid(d2), outerArc.centroid(d2), pos];
          //     };      
          //   });
          
          // polyline.exit()
          //   .remove();
        };



            }
          });
  // Our module now returns our view
  return FactsView;
});