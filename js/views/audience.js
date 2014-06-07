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
        var w = 600;
        var h = 400;
        var padding=30;
        var toggleRate=true;
        var toggleView=true;
          // get episode data
          d3.json("json/episodes.json", function(error, json) {
            if (error) return console.warn(error)
            ep_data = json;
            init();
          });  
        function toggleR(){
        if(toggleRate){
	        console.log("doit virer");
	        d3.select("path.graph").remove();
	        d3.selectAll("circle").remove();
	        toggleRate=!toggleRate;
        }
        else{
	        console.log("doit afficher");
	        toggleRate=!toggleRate;
        }
        
        
        }
        function toggleV(){
        
        }
        ;
 //-------------------------------------------------------INIT-------------------------------------------------------
        function init(){

        /*
//viewers each season with average of the season's episodes views
        for (var j=0;j<ep_data.seasons.length;j++){
        var totalOneSeason=0;
	    	for (var i = 0; i<ep_data.seasons[j].length; i++){
                    totalOneSeason+=ep_data.seasons[j][i].viewers
                    moy=totalOneSeason/ep_data.seasons[j].length
                    ep_data.seasons[j].viewers=Math.floor(moy*10)/10;   
             };
  
        };
*/        
     		//Create SVG element
            var svg = d3.select(".page")
                        .append("svg:svg")
                        .attr("width", w)
                        .attr("height", h)
                        .style("background-color","#2a4a7c");
                        
            var sidebar=d3.select(".page")
            	//.data(ep_data.seasons)
            	//.enter()
            	.append("div")
            	.attr("id","sidebar")
                .style("border", "1px solid black")
                .style("height","800px")
                .style("width","200px")  
                .style("position","absolute")
                .style("top",0)
                .style("right",0)
                .style("z-index","1000")
                 ;
             

             var currentSeason=d3.select("#sidebar")
             	.append("h2")
             	.attr("id","currentSeason")
             	.text("The 25 seasons")
             	;
             var seasonYear=d3.select("#sidebar")
             	.append("p")
             	.attr("id","seasonYear")
             	.style("display","inline")
             	.text("1989-2014 | ")
             	;
             var epInSeason=d3.select("#sidebar")
             	.append("p")
             	.attr("id","epInSeason")
             	.style("display","inline")
             	.text("252 episodes")
             	;
             var prevseason=d3.select("#sidebar")
             	.append("p")
             	.attr("id","prevseason")
             	.style("display","none")
             	.text("<<")
             	;
             var nextseason=d3.select("#sidebar")
             	.append("p")
             	.attr("id","nextseason")
             	.style("display","none")
             	.text(">>")
             	;
             /*
var refresh=d3.select("#sidebar")
             	.append("button")
             	.attr("id","refresh")
             	.text("refresh")
             	.on("click",function (d,i,l) {
             			d3.selectAll("svg").remove();
             			//d3.select("#sidebar").remove();
			            visualizeViewers() ;     
			    });
*/
             	var notes=d3.select("#sidebar")
             	.append("button")
             	.attr("id","notes")
             	.text("notes")
             	.on("click",function (d,i,l) {
             			//d3.selectAll("svg").remove();
             			//d3.select("#sidebar").remove();
             			toggleR();
			            visualizeRatings(svg);      
			    });
             	;

             	var audience=d3.select("#sidebar")
             	.append("button")
             	.attr("id","audience")
             	.text("audience")
             	.on("click",function (d,i,l) {
             			//d3.selectAll("svg").remove();
             			//d3.select("#sidebar").remove();
             			toggleR();
			            visualizeViewers(svg);      
			    });
             	;           	             	
             	//scale
            /*
var scaleX = d3.scale.linear().domain([1, ep_data.seasons.length]).range([padding, w-padding]);
            var scaleY = d3.scale.linear().domain([0, 35]).range([h-padding, padding]);
*/
            
            //axes
            /*
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
*/
                    
                    /*
var format = d3.time.format("%m/%d/%y");
                    var seasonsYear =format.parse(ep_data.seasons[0][0].airdate);
                    var yearNameFormat = d3.time.format("%Y");
                    seasonsYear=yearNameFormat(seasonsYear);
*/
                   
                        
             /*
var lineFunction = d3.svg.line()
                          .x(function(d,i) { return scaleX(i+1) })
                          .y(function(d,i) { return scaleY(ep_data.seasons[i].viewers)})
                          .interpolate("monotone");
                          
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
               .attr("cy", function(d,i){return scaleY(ep_data.seasons[i].viewers)})
               .on("mouseover", function(d,i){return tooltip
				.style("visibility","visible")
				.style("top","20px").style("left","400px")
				.text("Season "+(i+1)+" Rate "+ep_data.seasons[i].viewers+"/10")
				;
				})
				.on("mouseout", function(d,i){return tooltip.style("visibility","hidden")})
				.on("click",function (d,i,l) {
			            visualizeSeason(d,i,l);      
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
            function visualizeSeason(d,i,l){
            console.log("season viewers");
            
	           //updating sidebar
			            d3.select("#currentSeason").text("Season "+(i+1));
			            var seasonsYear =format.parse(ep_data.seasons[i][l].airdate);
			            var yearNameFormat = d3.time.format("%Y");
			            seasonsYear=yearNameFormat(seasonsYear);
			            d3.select("#seasonYear").text(seasonsYear+" | ")
			            d3.select("#epInSeason").text(ep_data.seasons[i].length+" episodes")
			            d3.select("#prevseason").style("display","inline")
			            d3.select("#nextseason").style("display","inline")
			            if(i==0){
				            d3.select("#prevseason").style("display","none")
			            }
			            if(i+1==ep_data.seasons.length){
				            d3.select("#nextseason").style("display","none")
			            }
			            d3.select("#prevseason").on("click",function () {
			            	i--;
			            	visualizeSeason(d,i,l);      
			            })
			            d3.select("#nextseason").on("click",function () {
			            	i++;
			            	visualizeSeason(d,i,l);      
			            });
			            
			            //removing old chart
			            d3.selectAll("circle").remove();
			            d3.select("path.graph").remove();
			            d3.select("g.xAxis").remove();
			            
			             //creating season graph
			             var scaleX = d3.scale.linear().domain([1, ep_data.seasons[i].length]).range([padding, w-padding]);
				         var scaleY = d3.scale.linear().domain([0, 35]).range([h-padding, padding]);
				         var xAxis = d3.svg.axis()
				                .scale(scaleX)
				                .orient("bottom")
				                ;           
				         var yAxis = d3.svg.axis()
		                    .scale(scaleY)
		                    .orient("left")
		                    ;
			             
			             //adding circles
			             svg.selectAll("circle")
			               .data(ep_data.seasons[i])
			               .enter()
			               .append("circle")
			               .attr("fill","white" )
			               .attr("stroke","#75c0e5")
			               .attr("stroke-width",2)
			               .attr("r", 5)
			               .attr("cx", function(f,j){return scaleX(j+1); } )
			               .attr("cy", function(f,j){return scaleY(ep_data.seasons[i][j].viewers)})
			              
			               //adding tooltip
			               .on("mouseover", function(f,j){return tooltip
							.style("visibility","visible")
							.style("top","20px").style("left","400px")
							.text("Episode "+(j+1)+" Rate "+ep_data.seasons[i][j].viewers+"/10")
							;
							})
							.on("mouseout", function(f,j){return tooltip.style("visibility","hidden")});
							var lineFunction = d3.svg.line()
								.x(function(f,j) { return scaleX(j+1) })
								.y(function(f,j) { return scaleY(ep_data.seasons[i][j].viewers)})
								.interpolate("monotone");
							
							//creating path
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
            }
*/
	visualizeRatings(svg);
        } //end init
        
 //------------------------------------------------------------END INIT----------------------------------------------------------        
        
        
 //-------------------------------------------------------VISUALIZEREVIEWS-------------------------------------------------------        
        function visualizeViewers(svg){        
        console.log("serie viewers")
        //viewers each season with average of the season's episodes views
        for (var j=0;j<ep_data.seasons.length;j++){
        var totalOneSeason=0;
	    	for (var i = 0; i<ep_data.seasons[j].length; i++){
                    totalOneSeason+=ep_data.seasons[j][i].viewers
                    moy=totalOneSeason/ep_data.seasons[j].length
                    ep_data.seasons[j].viewers=Math.floor(moy*10)/10;   
        };
  
        };        

            //scale
            var scaleX = d3.scale.linear().domain([1, ep_data.seasons.length]).range([padding, w-padding]);
            var scaleY = d3.scale.linear().domain([0, 35]).range([h-padding, padding]);
            
            //axes
            var xAxis = d3.svg.axis()
                  .scale(scaleX)
                  .orient("bottom")
                  .ticks(24)
                  ;
                  
            var yAxis = d3.svg.axis()
                    .scale(scaleY)
                    .orient("right")
                    //.ticks(4)
                    ;
                    
                    var format = d3.time.format("%m/%d/%y");
                    var seasonsYear =format.parse(ep_data.seasons[0][0].airdate);
                    var yearNameFormat = d3.time.format("%Y");
                    seasonsYear=yearNameFormat(seasonsYear);

                       
           /*
 //Create SVG element
            var svg = d3.select(".page")
                        .append("svg:svg")
                        .attr("width", w)
                        .attr("height", h)
                        .style("background-color","#2a4a7c")
*/
                   
                        
             var lineFunction = d3.svg.line()
                          .x(function(d,i) { return scaleX(i+1) })
                          .y(function(d,i) { return scaleY(ep_data.seasons[i].viewers)})
                          .interpolate("monotone");
                          
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
               .attr("cy", function(d,i){return scaleY(ep_data.seasons[i].viewers)})
               .on("mouseover", function(d,i){return tooltip
				.style("visibility","visible")
				.style("top","20px").style("left","400px")
				.text("Season "+(i+1)+" Rate "+ep_data.seasons[i].viewers+"/10")
				;
				})
				.on("mouseout", function(d,i){return tooltip.style("visibility","hidden")})
				.on("click",function (d,i,l) {
			            visualizeSeason(d,i,l);      
			    });
               
            
            //Create axis
            svg.append("g")
            .attr("class", "axis xAxis")  //Assign "axis" class
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis)
            ;
            
            svg.append("g")
            .attr("class", "axis yAxis")  //Assign "axis" class
            .attr("transform", "translate("+(w-padding) +",0)")
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
            function visualizeSeason(d,i,l){
            console.log("season viewers");
            
	           //updating sidebar
			            d3.select("#currentSeason").text("Season "+(i+1));
			            var seasonsYear =format.parse(ep_data.seasons[i][l].airdate);
			            var yearNameFormat = d3.time.format("%Y");
			            seasonsYear=yearNameFormat(seasonsYear);
			            d3.select("#seasonYear").text(seasonsYear+" | ")
			            d3.select("#epInSeason").text(ep_data.seasons[i].length+" episodes")
			            d3.select("#prevseason").style("display","inline")
			            d3.select("#nextseason").style("display","inline")
			            if(i==0){
				            d3.select("#prevseason").style("display","none")
			            }
			            if(i+1==ep_data.seasons.length){
				            d3.select("#nextseason").style("display","none")
			            }
			            d3.select("#prevseason").on("click",function () {
			            	i--;
			            	visualizeSeason(d,i,l);      
			            })
			            d3.select("#nextseason").on("click",function () {
			            	i++;
			            	visualizeSeason(d,i,l);      
			            });
			            
			            //removing old chart
			            d3.selectAll("circle").remove();
			            d3.select("path.graph").remove();
			            d3.select("g.xAxis").remove();
			            
			             //creating season graph
			             var scaleX = d3.scale.linear().domain([1, ep_data.seasons[i].length]).range([padding, w-padding]);
				         var scaleY = d3.scale.linear().domain([0, 35]).range([h-padding, padding]);
				         var xAxis = d3.svg.axis()
				                .scale(scaleX)
				                .orient("bottom")
				                ;           
				         var yAxis = d3.svg.axis()
		                    .scale(scaleY)
		                    .orient("left")
		                    ;
			             
			             //adding circles
			             svg.selectAll("circle")
			               .data(ep_data.seasons[i])
			               .enter()
			               .append("circle")
			               .attr("fill","white" )
			               .attr("stroke","#75c0e5")
			               .attr("stroke-width",2)
			               .attr("r", 5)
			               .attr("cx", function(f,j){return scaleX(j+1); } )
			               .attr("cy", function(f,j){return scaleY(ep_data.seasons[i][j].viewers)})
			              
			               //adding tooltip
			               .on("mouseover", function(f,j){return tooltip
							.style("visibility","visible")
							.style("top","20px").style("left","400px")
							.text("Episode "+(j+1)+" Rate "+ep_data.seasons[i][j].viewers+"/10")
							;
							})
							.on("mouseout", function(f,j){return tooltip.style("visibility","hidden")});
							var lineFunction = d3.svg.line()
								.x(function(f,j) { return scaleX(j+1) })
								.y(function(f,j) { return scaleY(ep_data.seasons[i][j].viewers)})
								.interpolate("monotone");
							
							//creating path
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
				         
            }
               
        } //end visualizeViewers
  //-----------------------------------------------------END VISUALIZE VIEWERS-------------------------------------------------------       
        
        
        
  //----------------------------------------------------- VISUALIZE RATINGS-------------------------------------------------------
        
        function visualizeRatings(svg){
	     console.log("serie ratings")
        //Rating each season with average of the season's episodes rates
        for (var j=0;j<ep_data.seasons.length;j++){
        var totalOneSeason=0;
	    	for (var i = 0; i<ep_data.seasons[j].length; i++){
                    totalOneSeason+=ep_data.seasons[j][i].rating
                    moy=totalOneSeason/ep_data.seasons[j].length
                    ep_data.seasons[j].rating=Math.floor(moy*10)/10;   
        };
  
        };        
            //scale
            var scaleX = d3.scale.linear().domain([1, ep_data.seasons.length]).range([padding, w-padding]);
            var scaleY = d3.scale.linear().domain([6, 8]).range([h-padding, padding]);
            
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
                    
                    var format = d3.time.format("%m/%d/%y");
                    var seasonsYear =format.parse(ep_data.seasons[0][0].airdate);
                    var yearNameFormat = d3.time.format("%Y");
                    seasonsYear=yearNameFormat(seasonsYear);

                       
            //Create SVG element
            /*
var svg = d3.select(".page")
                        .append("svg:svg")
                        .attr("width", w)
                        .attr("height", h)
                        .style("background-color","#2a4a7c")
*/
                   
                        
             var lineFunction = d3.svg.line()
                          .x(function(d,i) { return scaleX(i+1) })
                          .y(function(d,i) { return scaleY(ep_data.seasons[i].rating)})
                          .interpolate("monotone");
                          
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
				.style("top","20px").style("left","400px")
				.text("Season "+(i+1)+" Rate "+ep_data.seasons[i].rating+"/10")
				;
				})
				.on("mouseout", function(d,i){return tooltip.style("visibility","hidden")})
				.on("click",function (d,i,l) {
			            visualizeSeason(d,i,l);      
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
              
            function visualizeSeason(d,i,l){
            	console.log("season ratings");
	           //updating sidebar
			            d3.select("#currentSeason").text("Season "+(i+1));
			            var seasonsYear =format.parse(ep_data.seasons[i][l].airdate);
			            var yearNameFormat = d3.time.format("%Y");
			            seasonsYear=yearNameFormat(seasonsYear);
			            d3.select("#seasonYear").text(seasonsYear+" | ")
			            d3.select("#epInSeason").text(ep_data.seasons[i].length+" episodes")
			            d3.select("#prevseason").style("display","inline")
			            d3.select("#nextseason").style("display","inline")
			            if(i==0){
				            d3.select("#prevseason").style("display","none")
			            }
			            if(i+1==ep_data.seasons.length){
				            d3.select("#nextseason").style("display","none")
			            }
			            d3.select("#prevseason").on("click",function () {
			            	i--;
			            	visualizeSeason(d,i,l);      
			            });
			            d3.select("#nextseason").on("click",function () {
			            	i++;
			            	visualizeSeason(d,i,l);      
			            });
			            
			            
			            //removing old chart
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
		                    ;
			             
			             //adding circles
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
			              
			               //adding tooltip
			               .on("mouseover", function(f,j){return tooltip
							.style("visibility","visible")
							.style("top","20px").style("left","400px")
							.text("Episode "+(j+1)+" Rate "+ep_data.seasons[j][i].rating+"/10")
							;
							})
							.on("mouseout", function(f,j){return tooltip.style("visibility","hidden")});
							var lineFunction = d3.svg.line()
								.x(function(f,j) { return scaleX(j+1) })
								.y(function(f,j) { return scaleY(ep_data.seasons[i][j].rating)})
								.interpolate("monotone");
							
							//creating path
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
            }

               
        }
        //-----------------------------------------------------END VISUALIZE RATINGS-------------------------------------------------------
        
        
        // -----------------------------------FIN D3 AUDIENCE--------------------------------------------
      }
  });
  // Our module now returns our view
  return AudienceView;
});