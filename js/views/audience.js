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
        var toggleRate=false;
        var toggleView=false;
        var isInSeason=false;
        
        
          // get episode data
          d3.json("json/episodes.json", function(error, json) {
            if (error) return console.warn(error)
            ep_data = json;
            init();
          });
          
          //Create SVG element
            var svg = d3.select("#audience-module")
                        .append("svg:svg")
                        .attr("width", w)
                        .attr("height", h)
                        .style("background-color","#2a4a7c");
                        
            var tooltip = d3.select("#audience-module")
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
            
        function toggleR(svg){
	        if(toggleRate){
	        	$("#notes").removeClass("selected");
		        //d3.select("path.ratings").remove();
		        //d3.selectAll("circle.ratings").remove();
		        toggleRate=!toggleRate;
	  
	        }
	        else{
		        toggleRate=!toggleRate;      
		        d3.select("#notes").attr("class","selected");
		        /* visualizeRatings(svg); */
	        }        
        }
        
        function toggleV(svg){
        	if(toggleView){
        	$("#audiences").removeClass("selected");
	        //d3.select("path.viewers").remove();
	        //d3.selectAll("circle.viewers").remove();
	        toggleView=!toggleView;
	        
	        
	        }
	        else{
		        toggleView=!toggleView;
		        d3.select("#audiences").attr("class","selected");
	        	/* visualizeViewers(svg); */
	        }
        }
 //-------------------------------------------------------INIT-------------------------------------------------------
        function init(){
        isInSeason=false;
          	
             var refresh=d3.select("#refresh")
             	.on("click",function (d,i,l) {
             			if(toggleRate||toggleView){
				        d3.selectAll("circle").remove();
             			d3.selectAll("path").remove();
             			d3.selectAll("g.axis").remove();
             			if(toggleRate){
	             			toggleR(svg);
             			}
             			if(toggleView)
             			toggleV(svg);
             			init();
			            }
			    });
			    
             	var notes=d3.select("#notes")
             		.style("background","red")
             		.on("click",function (d,i,l) {
             			//d3.selectAll("svg").remove();
             			toggleR(svg);
             			if(isInSeason){
             				console.log(i);
	             			checkSeasonR(d,i,l);
             			}else
			            visualizeRatings(svg);      
			    });

             	var audience=d3.select("#audiences")
             		.on("click",function (d,i,l) {
             			//d3.selectAll("svg").remove();
             			toggleV(svg);
             			if(isInSeason){
             				console.log(i);
	             			checkSeasonV(d,i,l);
             			}else
			            visualizeViewers(svg);      
			    });
			    
			    toggleR(svg);
			    visualizeRatings(svg);
			    toggleV(svg);
			    visualizeViewers(svg);
        } //end init       
 //------------------------------------------------------------END INIT----------------------------------------------------------        
              
  //----------------------------------------------------- VISUALIZE RATINGS-------------------------------------------------------    
        function visualizeRatings(svg){
        
        	if(!toggleRate){  
	        d3.select("path.ratings").remove();
	        d3.selectAll("circle.ratings").remove();
	        //d3.selectAll("g.axis.ratings").remove();
	        }
        	else{
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
	                        
	            var lineFunction = d3.svg.line()
	                          .x(function(d,i) { return scaleX(i+1) })
	                          .y(function(d,i) { return scaleY(ep_data.seasons[i].rating)})
	                          .interpolate("monotone");
	                          
	             svg.append("path")
	             				.attr("class","graph")
	             				.attr("class","ratings")
	                            .attr("d", lineFunction(ep_data.seasons))
	                            .attr("stroke", "red")
	                            .attr("stroke-width", 2)
	                            .attr("fill", "none");
	
	            svg.selectAll("circle")
	               .data(ep_data.seasons)
	               .enter()
	               .append("circle")
	               .attr("class","ratings")
	               .attr("fill","white" )
	               .attr("stroke","red")
	               .attr("stroke-width",2)
	               .attr("r", 5)
	               .attr("cx", function(d,i){return scaleX(i+1); } )
	               .attr("cy", function(d,i){return scaleY(ep_data.seasons[i].rating)})
	               .on("mouseover", function(d,i){return tooltip
						.style("visibility","visible")
						.style("top","20px").style("left","400px")
						.text("Season "+(i+1)+" Rate "+ep_data.seasons[i].rating+"/10");})
						.on("mouseout", function(d,i){return tooltip.style("visibility","hidden")})
						.on("click",function (d,i,l) {
					            checkSeasonR(d,i,l);  
					            console.log(i);    
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
            }
        }
        
        
        function checkSeasonR(d,i,l){
        isInSeason=true;
        	console.log("ratings is "+toggleRate);
        	console.log("viewers is "+toggleView);
        
	        if(toggleView){
		            //toggleV(svg);
		            showSeasonV(d,i,l);
		            console.log("in rate show the season's viewers");
	        }
            else
            {
            	console.log("in rate don't show the season's viewers");
	          //toggleV(svg);
	          //toggleR(svg);
            }
            showSeasonR(d,i,l);
            
       }
       function showSeasonR(d,i,l){            
            console.log("in rate show the season's ratings");
            	var format = d3.time.format("%m/%d/%y");
                    var seasonsYear =format.parse(ep_data.seasons[0][0].airdate);
                    var yearNameFormat = d3.time.format("%Y");
                    seasonsYear=yearNameFormat(seasonsYear);
            	
	           //updating sidebar
			            d3.select("#currentSeason").text("Season "+(i+1));
			            
			            var seasonsYear =format.parse(ep_data.seasons[i][l].airdate);
			            var yearNameFormat = d3.time.format("%Y");
			            seasonsYear=yearNameFormat(seasonsYear);
			            
			            d3.select("#seasonYear").text(seasonsYear+" | ")
			            d3.select("#epInSeason").text(""+ep_data.seasons[i].length)
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
			            	checkSeasonR(d,i,l);      
			            });
			            d3.select("#nextseason").on("click",function () {
			            	i++;
			            	checkSeasonR(d,i,l);     
			            });
			            
			            
			            //removing old chart
			            d3.select("path.ratings").remove();
			            d3.selectAll("circle.ratings").remove();
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
			             
			             var lineFunction = d3.svg.line()
								.x(function(f,j) { return scaleX(j+1) })
								.y(function(f,j) { return scaleY(ep_data.seasons[i][j].rating)})
								.interpolate("monotone");
							
							//creating path
							svg.append("path")
             				.attr("class","graph")
             				.attr("class","ratings")
                            .attr("d", lineFunction(ep_data.seasons[i]))
                            .attr("stroke", "red")
                            .attr("stroke-width", 2)
                            .attr("fill", "none");
                            
			             //adding circles
			             svg.selectAll("circle")
			               .data(ep_data.seasons[i])
			               .enter()
			               .append("circle")
			               .attr("class","ratings")
			               .attr("fill","white" )
			               .attr("stroke","red")
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
                            
			             svg.append("g")
				            .attr("class", "axis xAxis")  //Assign "axis" class
				            .attr("transform", "translate(0," + (h - padding) + ")")
				            .call(xAxis)
				            ;}
  //-----------------------------------------------------END VISUALIZE RATINGS-------------------------------------------------------
  
  //-------------------------------------------------------VISUALIZEREVIEWS-------------------------------------------------------        
        function visualizeViewers(svg){        
		    if(!toggleView){  
	        	d3.select("path.viewers").remove();
	        	d3.selectAll("circle.viewers").remove();
	        }
	        else{
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
	                   
	                        
	             var lineFunction = d3.svg.line()
	                          .x(function(d,i) { return scaleX(i+1) })
	                          .y(function(d,i) { return scaleY(ep_data.seasons[i].viewers)})
	                          .interpolate("monotone");
	                          
	             svg.append("path")
	             	.attr("class","graph")
	             	.attr("class","viewers")
	                .attr("d", lineFunction(ep_data.seasons))
	                .attr("stroke", "#75c0e5")
	                .attr("stroke-width", 2)
	                .attr("fill", "none");
	
	            svg.selectAll("circle")
	               .data(ep_data.seasons)
	               .enter()
	               .append("circle")
	               .attr("fill","white" )
	               .attr("class","viewers")
	               .attr("stroke","#75c0e5")
	               .attr("stroke-width",2)
	               .attr("r", 5)
	               .attr("cx", function(d,i){return scaleX(i+1); } )
	               .attr("cy", function(d,i){return scaleY(ep_data.seasons[i].viewers)})
	               .on("mouseover", function(d,i){return tooltip
		           		.style("visibility","visible")
		           		.style("top","20px").style("left","400px")
		           		.text("Season "+(i+1)+" "+ep_data.seasons[i].viewers+" millions viewers")
		           	;})
					.on("mouseout", function(d,i){return tooltip.style("visibility","hidden")})
					.on("click",function (d,i,l) {
				    	checkSeasonV(d,i,l);      
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
               
            } //end visualizeViewers
        }
        
        function checkSeasonV(d,i,l){
        isInSeason=true;
        	console.log("ratings is "+toggleRate);
        	console.log("viwers is "+toggleView);
            
            if(toggleRate){
	            //toggleR(svg);
	            showSeasonR(d,i,l);
	            console.log("in view show the season's ratings");
            }
            else{
	          //toggleV(svg);
	          //toggleR(svg);
	          console.log("in view don't show the season's ratings");
            }
            showSeasonV(d,i,l);
            
				         
            }
            function showSeasonV(d,i,l){
	            
            
            console.log("in view, show the season's viewers");
	           //updating sidebar
			            d3.select("#currentSeason").text("Season "+(i+1));
			            
			        var format = d3.time.format("%m/%d/%y");
                    var seasonsYear =format.parse(ep_data.seasons[0][0].airdate);
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
			            	checkSeasonV(d,i,l);   
			            })
			            d3.select("#nextseason").on("click",function () {
			            	i++;
			            	checkSeasonV(d,i,l);      
			            });
			            
			            //removing old chart
			            d3.select("path.viewers").remove();
			            d3.selectAll("circle.viewers").remove();
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
		                    
		                    var lineFunction = d3.svg.line()
								.x(function(f,j) { return scaleX(j+1) })
								.y(function(f,j) { return scaleY(ep_data.seasons[i][j].viewers)})
								.interpolate("monotone");
							
							//creating path
							svg.append("path")
             				.attr("class","graph")
             				.attr("class","viewers")
                            .attr("d", lineFunction(ep_data.seasons[i]))
                            .attr("stroke", "#75c0e5")
                            .attr("stroke-width", 2)
                            .attr("fill", "none");
			             
			             //adding circles
			             svg.selectAll("circle")
			               .data(ep_data.seasons[i])
			               .enter()
			               .append("circle")
			               .attr("fill","white" )
			               .attr("class","viewers")
			               .attr("stroke","#75c0e5")
			               .attr("stroke-width",2)
			               .attr("r", 5)
			               .attr("cx", function(f,j){return scaleX(j+1); } )
			               .attr("cy", function(f,j){return scaleY(ep_data.seasons[i][j].viewers)})
			              
			               //adding tooltip
			               .on("mouseover", function(f,j){return tooltip
							.style("visibility","visible")
							.style("top","20px").style("left","400px")
							.text("Episode "+(j+1)+" "+ep_data.seasons[i][j].viewers+" millions viewers")
							;
							})
							.on("mouseout", function(f,j){return tooltip.style("visibility","hidden")});
							
			             svg.append("g")
				            .attr("class", "axis xAxis")  //Assign "axis" class
				            .attr("transform", "translate(0," + (h - padding) + ")")
				            .call(xAxis)
				            ;
				            }
  //-----------------------------------------------------END VISUALIZE VIEWERS-------------------------------------------------------       
         
        
        // -----------------------------------FIN D3 AUDIENCE--------------------------------------------
      }
  });
  // Our module now returns our view
  return AudienceView;
});