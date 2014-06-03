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
        $('#audienceButton').addClass('selected');$('.page').addClass('violet');
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

    //RANDOMLY RATE EVERY EPISODE
    /*
for (var i = 0; i < ep_data.seasons.length; ++i){
                for (var j = 0; j < ep_data.seasons[i].length; ++j){
                    ep_data.seasons[i][j].rating=3+Math.floor((Math.random()*6));
                     //console.log(ep_data.seasons[i][j].rating);
                };
        };
*/

    //RATE EVERY SEASON
    var seasonsRates=[5.8,5.7,3.4,3.9,5.2,7.3,3.8,4.2,5.8,6.5,2.3,3.7,7.8,6.2,2.5,3.4,4.7,3.5,4.8,7.2,5.7,7.9,4.1,5.5,4.2 ]
    for (var i = 0; i < ep_data.seasons.length; ++i){
                    ep_data.seasons[i].rating=seasonsRates[i];
        };

       

          //Width and height
            var w = 600;
            var h = 400;
            var padding=25;
            //scale
            var scaleX = d3.scale.linear().domain([1, ep_data.seasons.length]).range([padding, w-padding]);
            var scaleY = d3.scale.linear().domain([0, 10]).range([h-padding, padding]);
            
            //axes
            var xAxis = d3.svg.axis()
                  .scale(scaleX)
                  .orient("bottom")
                  .ticks(24)
                  ;
                  
            var yAxis = d3.svg.axis()
                    .scale(scaleY)
                    .orient("left")
                    //.ticks(4)
                    ;
                       
            
            /*
var parseDate = d3.time.format("%Y").parse;
            var air = parseDate(ep_data.seasons[5][9].airdate);
            console.log(air);
*/
            
            var dattte=Date.parse(ep_data.seasons[5][9].airdate);
            console.log(dattte);
            
            
           
            
            
            var sidebar=d3.select("body")
            	//.data(ep_data.seasons)
            	//.enter()
            	.append("div")
                .style("border", "1px solid black")
                .style("height","100px")
                .style("width","200px")  
                .style("position","absolute")
                .style("top",0)
                .style("right",0)
                .style("z-index","1000")
               // .text(air)
                 ;
                        
                                              
            /*
$("body").append("<div id='sidebar' style='border:1px solid black;height:100%;width:200px;position:absolute;right:0;top:0;z-index:1000;'><h1 id='seasonz'></h1></div>");
            d3.select("#seasonz").text("the 25 seasons");
            //create switch audiences/rates
            $( "#sidebar" ).append( "<button class='switch' id='fuck'>Audience</button>" );
            $( "#sidebar" ).append( "<button class='switch' id='truc'>Rates</button>" );
*/

            
            //create top/flops
            //$( ".page" ).append( "<h3 class='top'></h3><ol><li id='prems'></li><li id='deuz'></li><li id='troiz'></li></ol>" );  
            
            var tops = d3.select("body")
            	.data(ep_data.seasons)
            	.enter()
            	.append("p")
            	//.text(function(d,i){return (ep_data.seasons[i].rating)})
            	.style("top", 0 )
            	.style("left", 0)
              ;  
                     
             /*
var tops=[];
             for (var i = 0; i < ep_data.seasons.length; ++i){
                    tops[i]=ep_data.seasons[i].rating;
                    }; 
              var top=d3.max(tops);
*/
              
            //Create SVG element
            var svg = d3.select(".page")
                        .append("svg:svg")
                        .attr("width", w)
                        .attr("height", h)
                        .style("background-color","#2a4a7c")
                   
                        
             var lineFunction = d3.svg.line()
                          .x(function(d,i) { return scaleX(i+1) })
                          .y(function(d,i) { return scaleY(ep_data.seasons[i].rating)})
                          .interpolate("linear");
                          
             svg.append("path")
             				.attr("class","graph")
                            .attr("d", lineFunction(ep_data.seasons))
                            .attr("stroke", "white")
                            .attr("stroke-width", 2)
                            .attr("fill", "none");

            svg.selectAll("circle")
               .data(ep_data.seasons)
               .enter()
               .append("circle")
               .attr("fill","white" )
               .attr("stroke","#75c0e5")
               .attr("stroke-width",2)
               .attr("r", 5)
               .attr("cx", function(d,i){return scaleX(i+1); } )
               .attr("cy", function(d,i){return scaleY(ep_data.seasons[i].rating)})
               .on("mouseover", function(d,i){return tooltip
				.style("visibility","visible")
				.style("top","130px").style("left","400px")
				.text("Season "+(i+1)+" Rate "+ep_data.seasons[i].rating+"/10")
				;
				})
				.on("mouseout", function(d,i){return tooltip.style("visibility","hidden")})
				//removing serie graph
				.on("click",function (d,i,l) {
			            d3.select("#choose").text("< Season "+(i+1)+" >");
			            d3.selectAll("circle").remove();
			            d3.select("path.graph").remove();
			            d3.select("g.xAxis").remove();
			             //creating season graph
			             var scaleX = d3.scale.linear().domain([1, ep_data.seasons[i].length]).range([padding, w-padding]);
				         var scaleY = d3.scale.linear().domain([0, 10]).range([h-padding, padding]);
				         var xAxis = d3.svg.axis()
				                .scale(scaleX)
				                .orient("bottom")
				                ;           
				         var yAxis = d3.svg.axis()
		                    .scale(scaleY)
		                    .orient("left")
		                    //.ticks(4)
		                    ;
			             svg.selectAll("circle")
			               .data(ep_data.seasons[i])
			               .enter()
			               .append("circle")
			               .attr("fill","white" )
			               .attr("stroke","#75c0e5")
			               .attr("stroke-width",2)
			               .attr("r", 5)
			               .attr("cx", function(f,j){return scaleX(j+1); } )
			               .attr("cy", function(f,j){return scaleY(ep_data.seasons[i][j].rating)})
			               .on("mouseover", function(f,j){return tooltip
							.style("visibility","visible")
							.style("top","130px").style("left","400px")
							.text("Episode "+(i+1)+" Rate "+ep_data.seasons[i][j].rating+"/10")
							;
							})
							.on("mouseout", function(f,j){return tooltip.style("visibility","hidden")});
							var lineFunction = d3.svg.line()
								.x(function(f,j) { return scaleX(j+1) })
								.y(function(f,j) { return scaleY(ep_data.seasons[i][j].rating)})
							.interpolate("linear");
							svg.append("path")
             				.attr("class","graph")
                            .attr("d", lineFunction(ep_data.seasons[i]))
                            .attr("stroke", "white")
                            .attr("stroke-width", 2)
                            .attr("fill", "none");
                            
                            
			             svg.append("g")
				            .attr("class", "axis xAxis")  //Assign "axis" class
				            .attr("transform", "translate(0," + (h - padding) + ")")
				            .call(xAxis)
				            ;
			             
			    });
               
            
            //Create axis
            svg.append("g")
            .attr("class", "axis xAxis")  //Assign "axis" class
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis)
            ;
            
            svg.append("g")
            .attr("class", "axis yAxis")  //Assign "axis" class
            .attr("transform", "translate("+(padding) +",0)")
            .call(yAxis)
            ;
            
            var tooltip = d3.select("body")
              .append("div")
              .style("position", "absolute")
              .style("padding","10px")
              .style("border","1px solid white")
              .style("border-radius","3px")
              .style("visibility", "hidden")
              .style("color","white")
              .style("top", 0 )
              .style("left", 0)
              ;
         
            
            //console.log(ep_data);//Les 25 saisons (copie du json)
            //console.log(ep_data.seasons); //Les 25 saisons - un tableau par saison
            //console.log(ep_data.seasons[0]);//Données des x épisodes de la saison 0
            //console.log(ep_data.seasons[0][0]);//Données de l'épisode 0 de la saison 0
            //console.log(ep_data.seasons[7][9].rating);

               
        } //end visualizeit
        // -----------------------------------FIN D3 AUDIENCE--------------------------------------------
      }
  });
  // Our module now returns our view
  return AudienceView;
});