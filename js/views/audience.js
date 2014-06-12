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
      	$('body').scrollTop(0);
        $('#menu').removeClass('hidden');
        $('#audienceButton').addClass('selected');
        $('#factsButton').removeClass('selected');$('#charactersButton').removeClass('selected');$('#homeButton').removeClass('selected');$('#contributeButton').removeClass('selected');
        $('.page').fadeIn(300);
         // ----------------------------------------D3 AUDIENCE---------------------------------------------
        var ep_data; // a global variable for the data of all episode of all seasons
        var w = 550;
        var h = 350;
        var padding=30;
        var toggleRate=false;
        var toggleView=false;
        var isInSeason=false;
        var scaleYl;
        var scaleYr;
        var scaleX;
        var format;
        var currentSeason;
        var currentSeasonlong;
        var i;
        
        
        
          // get episode data
          d3.json("json/episodes.json", function(error, json) {
            if (error) return console.warn(error)
            ep_data = json;
            init();
          });
          
          //Create SVG element
            var svg = d3.select("#courbe")
                        .append("g")
                        .attr("transform", "translate(200,156.1)")
                        ;
                        
            var tooltip = d3.select("body")
          .append("div")
          .style("position", "absolute")
          .style("z-index", "10")
          .style("background-color", "rgba(255,255,255,0.8)")
          .style("padding", "5px 10px")
          .style("font-size","12px")
          .style("font-family","arial")
          .style("visibility", "hidden");
          
            
        function toggleR(svg){
	        if(toggleRate){
	        	$("#ratingsButton").removeClass("selected");
		        toggleRate=!toggleRate;
	        }
	        else{
		        toggleRate=!toggleRate;      
		        $("#ratingsButton").addClass("selected");
		        $("#toto")
		        .attr("attributeName","transform")
		        .attr("begin","0s")
		        .attr("dur","2s")
		        .attr("type","rotate")
		        .attr("from","0 1160.85 137.932")
		        .attr("to","-30 1160.85 137.932")
		        .attr("repeatCount","3")
		        ;
	        }        
        }
        
        function toggleV(svg){
        	if(toggleView){
        	$("#viewersButton").removeClass("selected");
	        toggleView=!toggleView;
	        
	        
	        }
	        else{
		        toggleView=!toggleView;
		        $("#viewersButton").addClass("selected");
	        }
        }
 //-------------------------------------------------------INIT-------------------------------------------------------
        function init(){
        isInSeason=false;
          	
             var cleanButton=d3.select("#cleanButton")
             	.on("click",function (m,n,p) {
             			if(toggleRate||toggleView){
				        //d3.selectAll("circle").remove();
             			d3.selectAll("path.viewers").remove();
             			d3.selectAll("circle.viewers").remove();
             			d3.selectAll("path.ratings").remove();
             			d3.selectAll("circle.ratings").remove();
             			d3.selectAll("g.axis").remove();
             			if(toggleRate){
	             			toggleR(svg);
             			}
             			if(toggleView)
             			toggleV(svg);
			            }
			            init();
			    });
			    
             	var notes=d3.select("#ratingsButton")
             		.on("click",function (m,n,p) {
						if(toggleRate){
							toggleR(svg);  
					        d3.select("path.ratings").remove();
					        d3.selectAll("circle.ratings").remove();
					        
					    }
			        	else{
			        		toggleR(svg);
			        		if(isInSeason){
	             				d3.select("path.ratings").remove();
	             				d3.selectAll("circle.ratings").remove();
	             				m=currentSeasonlong;
	             				n=currentSeason;
		             			check(m,n,p);
		             		}else
		             			showRatingsSerie(svg);
		             		}
			    });

             	var audience=d3.select("#viewersButton")
             		.on("click",function (m,n,p) {
	             		if(toggleView){
		             		toggleV(svg);  
		             		d3.select("path.viewers").remove();
		             		d3.selectAll("circle.viewers").remove();
		             	}
		             	else{
				        	toggleV(svg);
				        	if(isInSeason){
             					d3.select("path.reviews").remove();
	             				d3.selectAll("circle.reviews").remove();
	             				m=currentSeasonlong;
	             				n=currentSeason;
		             			check(m,n,p);
		             		}else
		             			showViewersSerie(svg);
		             		}
		         });
		        
		        scaleYl = d3.scale.linear().domain([5, 9.5]).range([h-padding, padding]);
		        scaleYr = d3.scale.linear().domain([0, 35]).range([h-padding, padding]);
			    
			    var ylAxis = d3.svg.axis()
		                    .scale(scaleYl)
		                    .orient("left")
		                    ;
		                    
		        var yrAxis = d3.svg.axis()
	                    .scale(scaleYr)
	                    .orient("right")
	                    //.ticks(4)
	                    ;
		        svg.append("rect").attr("fill","#999999").attr("width",w).attr("height",h);       
		        
		        svg.append("g")
	            .attr("class", "axis ylAxis")  //Assign "axis" class
	            .attr("transform", "translate("+(padding) +",0)")
	            .call(ylAxis)
	            ;
	            
	            svg.append("g")
	            .attr("class", "axis yrAxis")  //Assign "axis" class
	            .attr("transform", "translate("+(w-padding) +",0)")
	            .call(yrAxis)
	            ; 
	            
	           //updating sidebar
			   d3.select("#currentSeason").text("Select one season");
			   d3.select("#seasonYear").text("252 episodes");
			   /*
d3.select("#epInSeason").text("");
			   d3.select("#epInSeason").style("font-family","Langdon");
			   d3.select("#epInSeason").style("text-transform","uppercase");
*/
			   d3.select("#currentSeason").style("font-family","Langdon");
			   d3.select("#currentSeason").style("text-transform","uppercase");
			   d3.select("#seasonYear").style("font-family","Langdon");
			   d3.select("#seasonYear").style("text-transform","uppercase");
			   
			   d3.select("#prev_hover").style("visibility","hidden");
			   d3.select("#prevSeason").on("mouseover", function(m,n){d3.select("#prev_hover").style("visibility","visible");});
			   d3.select("#prevSeason").on("mouseout", function(m,n){d3.select("#prev_hover").style("visibility","hidden");});
			   
			   d3.select("#next_hover").style("visibility","hidden");
			   d3.select("#nextSeason").on("mouseover", function(m,n){d3.select("#next_hover").style("visibility","visible");});
			   d3.select("#nextSeason").on("mouseout", function(m,n){d3.select("#next_hover").style("visibility","hidden");});
			   
			             
		        
			    makeRatings(svg);
			    makeViewers(svg);
			    toggleR(svg);
			    showRatingsSerie(svg);
			    toggleV(svg);
			    showViewersSerie(svg);
			    
			    d3.select("#topflop").text("TOP RATING : #");
			    $("#nextSeason").hide();
			    $("#prevSeason").hide();
			    
			    
			    
        } //end init
        function tops(currentSeasonlong,currentSeason,p){        	
var tabmaxR=new Array();
var tabminR=new Array();
var tabmaxV=new Array();
var tabminV=new Array();
var maxR;
var minR;
var maxV;
var minV;
var theMaxR;
var theMinR;
var theMaxV;
var theMinV;

	        for (var w=0;w<currentSeasonlong.length;w++){
		        tabmaxR.push(ep_data.seasons[currentSeason][w].rating);
		        tabminR.push(ep_data.seasons[currentSeason][w].rating);
		        tabmaxV.push(ep_data.seasons[currentSeason][w].viewers);
		        tabminV.push(ep_data.seasons[currentSeason][w].viewers);
		        maxR=d3.max(tabmaxR);
		        minR=d3.min(tabminR);
		        maxV=d3.max(tabmaxV);
		        minV=d3.min(tabminV);
		        theMaxR=tabmaxR.indexOf(maxR);
		        theMinR=tabminR.indexOf(minR);
		        theMaxV=tabmaxV.indexOf(maxV);
		        theMinV=tabminV.indexOf(minV);
	        }
	        theMaxR=theMaxR;
	        theMin=theMinR;
	        theMax=theMaxV;
	        theMin=theMinV;
	        
	        d3.select("#topflop").text("TOP RATING : #"+(theMaxR+1)+" : "+ep_data.seasons[currentSeason][theMaxR].title+" ("+ep_data.seasons[currentSeason][theMaxR].rating+"/10) -- "
	        +"FLOP RATING : #"+(theMinR+1)+" : "+ep_data.seasons[currentSeason][theMinR].title+" ("+ep_data.seasons[currentSeason][theMinR].rating+"/10) -- "
	        +"TOP VIEWERS : #"+(theMaxV+1)+" : "+ep_data.seasons[currentSeason][theMaxV].title+" ("+ep_data.seasons[currentSeason][theMaxV].viewers+"M viewers) -- "
	        +"FLOP VIEWERS : #"+(theMinV+1)+" : "+ep_data.seasons[currentSeason][theMinV].title+" ("+ep_data.seasons[currentSeason][theMinV].viewers+"M viewers). ");

        }       
 //------------------------------------------------------------END INIT----------------------------------------------------------        
         function makeRatings(svg){
         console.log("makeratings");
	         //Rating each season with average of the season's episodes rates
		        for (var m=0;m<ep_data.seasons.length;m++){
			        var totalOneSeason=0;
				    	for (var n = 0; n<ep_data.seasons[m].length; n++){
			                    totalOneSeason+=ep_data.seasons[m][n].rating
			                    moy=totalOneSeason/ep_data.seasons[m].length
			                    ep_data.seasons[m].rating=Math.floor(moy*10)/10;
			             };
		        };  
         }
         
         function makeViewers(svg){
         console.log("makeviewers");
	         for (var m=0;m<ep_data.seasons.length;m++){
		        	var totalOneSeason=0;
			    	for (var n = 0; n<ep_data.seasons[m].length; n++){
		                    totalOneSeason+=ep_data.seasons[m][n].viewers
		                    moy=totalOneSeason/ep_data.seasons[m].length
		                    ep_data.seasons[m].viewers=+Math.floor(moy*10)/10;
		            };
		        }; 
         }
         
         function check(d,i,l){
         d3.select("#currentSeason").text("Season "+(i+1));
         isInSeason=true;
			            format = d3.time.format("%m/%d/%y");
			            var seasonsYear=format.parse(ep_data.seasons[i][l].airdate);
			            var yearNameFormat = d3.time.format("%Y");
			            seasonsYear=yearNameFormat(seasonsYear);
			            d3.select("#seasonYear").text(seasonsYear+" | "+ep_data.seasons[i].length+" episodes")
			            d3.select("#prevSeason").style("display","inline")
			            d3.select("#nextSeason").style("display","inline")
			            if(i==0){
				            d3.select("#prevSeason").style("display","none")
			            }
			            if(i+1==ep_data.seasons.length){
				            d3.select("#nextSeason").style("display","none")
			            }
			            d3.select("#prevSeason").on("click",function () {
			            	i--;
			            	check(d,i,l);      
			            });
			            d3.select("#nextSeason").on("click",function () {
			            	i++;
			            	check(d,i,l);     
			            });
			            tops(d,i,l);
         	if(isInSeason){
	         	if(toggleRate){
		         	showRatingsSeason(d,i,l);
	         	}
	         	if(toggleView){
		         	showViewersSeason(d,i,l);
	         	}
         	}
				         
            }     
  //----------------------------------------------------- VISUALIZE RATINGS-------------------------------------------------------    
        function showRatingsSerie(svg){
	            //scale
	            scaleX = d3.scale.linear().domain([1, ep_data.seasons.length]).range([padding, w-padding]);
	            //scaleYl = d3.scale.linear().domain([5, 9.5]).range([h-padding, padding]);
	            
	            //axes
	            var xAxis = d3.svg.axis()
	                  .scale(scaleX)
	                  .orient("bottom")
	                  .ticks(24)
	                  ;            
	                        
	            var lineFunction = d3.svg.line()
	                          .x(function(m,n) { return scaleX(n+1) })
	                          .y(function(m,n) { return scaleYl(ep_data.seasons[n].rating)})
	                          .interpolate("monotone");
	                          
	             svg.append("path")
	             				.attr("class","graph")
	             				.attr("class","ratings")
	                            .attr("d", lineFunction(ep_data.seasons))
	                            .attr("stroke", "red")
	                            .attr("stroke-width", 2)
	                            .attr("fill", "none");
	                            
	            svg.selectAll("circle.ratings")
	               .data(ep_data.seasons)
	               .enter()
	               .append("circle")
	               .attr("class","ratings")
	               .attr("fill","white" )
	               .attr("stroke","red")
	               .attr("stroke-width",2)
	               .attr("r", 5)
	               .attr("cx", function(m,n){return scaleX(n+1); } )
	               .attr("cy", function(m,n){return scaleYl(ep_data.seasons[n].rating)})
	               .on("mouseover", function(m,n){return tooltip
						.style("visibility","visible")
						.style("top","20px").style("left","400px")
						.text("Season "+(n+1)+" Rate "+ep_data.seasons[n].rating+"/10");})
						.on("mouseout", function(m,n){return tooltip.style("visibility","hidden")})
						.on("mousemove", function (){ return tooltip.style("top",
                (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px"); })
						.on("click",function (m,n,p) {
					            currentSeason=n;
					            currentSeasonlong=m;
					            check(currentSeasonlong,currentSeason,p);
					            tops(currentSeasonlong,currentSeason,p);  
					                
				    });
	               
	            
	           if(d3.select("g.xAxis").empty()){
	           		svg.append("g")
	           		.attr("class", "axis xAxis")  //Assign "axis" class
	           		.attr("transform", "translate(0," + (h - padding) + ")")
	           		.call(xAxis)
				    ; 
               }

        }

       function showRatingsSeason(d,i,l){
            	currentSeason=i;
            	currentSeasonlong=d;
	           //updating sidebar
			            /*
d3.select("#currentSeason").text("Season "+(i+1));
			            format = d3.time.format("%m/%d/%y");
			            var seasonsYear=format.parse(ep_data.seasons[i][l].airdate);
			            var yearNameFormat = d3.time.format("%Y");
			            seasonsYear=yearNameFormat(seasonsYear);
			            console.log(seasonsYear);
			            d3.select("#seasonYear").text(seasonsYear+" | ")
			            d3.select("#epInSeason").text(""+ep_data.seasons[i].length)
			            d3.select("#prevSeason").style("display","inline")
			            d3.select("#nextSeason").style("display","inline")
			            if(i==0){
				            d3.select("#prevSeason").style("display","none")
			            }
			            if(i+1==ep_data.seasons.length){
				            d3.select("#nextSeason").style("display","none")
			            }
			            d3.select("#prevSeason").on("click",function () {
			            	i--;
			            	check(d,i,l);      
			            });
			            d3.select("#nextSeason").on("click",function () {
			            	i++;
			            	check(d,i,l);     
			            });
*/
			            
			            
			            //removing old chart
			            d3.select("path.ratings").remove();
			            d3.selectAll("circle.ratings").remove();
			            d3.select("g.xAxis").remove();
			             //creating season graph
			             scaleX = d3.scale.linear().domain([1, ep_data.seasons[i].length]).range([padding, w-padding]);
				         //scaleYl = d3.scale.linear().domain([4.5, 9.5]).range([h-padding, padding]);
				         
				         var xAxis = d3.svg.axis()
				                .scale(scaleX)
				                .orient("bottom")
				                ;           
				                		             
			             var lineFunction = d3.svg.line()
								.x(function(m,n) { return scaleX(n+1) })
								.y(function(m,n) { return scaleYl(ep_data.seasons[i][n].rating)})
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
			             svg.selectAll("circle.ratings")
			               .data(ep_data.seasons[i])
			               .enter()
			               .append("circle")
			               .attr("class","ratings")
			               .attr("fill","white" )
			               .attr("stroke","red")
			               .attr("stroke-width",2)
			               .attr("r", 5)
			               .attr("cx", function(m,n){return scaleX(n+1); } )
			               .attr("cy", function(m,n){return scaleYl(ep_data.seasons[i][n].rating)})
			               //adding tooltip
			               .on("mouseover", function(m,n){return tooltip
								.style("visibility","visible")
								.style("top","20px").style("left","400px")
								.text("Episode "+(n+1)+" Rate "+ep_data.seasons[i][n].rating+"/10")
								;
							})
							.on("mousemove", function (){ return tooltip.style("top",
                (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px"); })
							.on("mouseout", function(m,n){return tooltip.style("visibility","hidden")});
                            
                            if(d3.select("g.xAxis").empty()){
	                           svg.append("g")
	                           		.attr("class", "axis xAxis")  //Assign "axis" class
	                           		.attr("transform", "translate(0," + (h - padding) + ")")
	                           		.call(xAxis)
	                           		; 
                            }			             
				        }
				        
  //-----------------------------------------------------END VISUALIZE RATINGS-------------------------------------------------------
  
  //-------------------------------------------------------VISUALIZEREVIEWS-------------------------------------------------------        
        function showViewersSerie(svg){
		    if(!toggleView){  
	        	d3.select("path.viewers").remove();
	        	d3.selectAll("circle.viewers").remove();
	        }
	        else{

	            //scale
	            scaleX = d3.scale.linear().domain([1, ep_data.seasons.length]).range([padding, w-padding]);
	            /* scaleYr = d3.scale.linear().domain([0, 35]).range([h-padding, padding]); */
	            
	            //axes
	            var xAxis = d3.svg.axis()
	                  .scale(scaleX)
	                  .orient("bottom")
	                  .ticks(24)
	                  ;
	                    
	             var lineFunction = d3.svg.line()
	                          .x(function(m,n) { return scaleX(n+1) })
	                          .y(function(m,n) { return scaleYr(ep_data.seasons[n].viewers)})
	                          .interpolate("monotone");
	            
	            /*
format = d3.time.format("%m/%d/%y");
	            var seasonsYear =format.parse(ep_data.seasons[0][0].airdate);
	            var yearNameFormat = d3.time.format("%Y");
	            seasonsYear=yearNameFormat(seasonsYear);
*/
	                                 
	             svg.append("path")
	             	.attr("class","graph")
	             	.attr("class","viewers")
	                .attr("d", lineFunction(ep_data.seasons))
	                .attr("stroke", "#75c0e5")
	                .attr("stroke-width", 2)
	                .attr("fill", "none");
	
	            svg.selectAll("circle.viewers")
	               .data(ep_data.seasons)
	               .enter()
	               .append("circle")
	               .attr("fill","white" )
	               .attr("class","viewers")
	               .attr("stroke","#75c0e5")
	               .attr("stroke-width",2)
	               .attr("r", 5)
	               .attr("cx", function(m,n){return scaleX(n+1); } )
	               .attr("cy", function(m,n){return scaleYr(ep_data.seasons[n].viewers)})
	               .on("mouseover", function(d,i){return tooltip
		           		.style("visibility","visible")
		           		.style("top","20px").style("left","400px")
		           		.text("Season "+(i+1)+" "+ep_data.seasons[i].viewers+"M viewers")
		           	;})
		           	.on("mousemove", function (){ return tooltip.style("top",
                (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px"); })
					.on("mouseout", function(m,n){return tooltip.style("visibility","hidden")})
					.on("click",function (m,n,p) {
							currentSeason=n;
					         currentSeasonlong=m;
				    	check(currentSeasonlong,currentSeason,p);      
				    });
	               
	            
	            //Create axis
	            if(d3.select("g.xAxis").empty()){
	            	svg.append("g")
	            		.attr("class", "axis xAxis")  //Assign "axis" class
	            		.attr("transform", "translate(0," + (h - padding) + ")")
				        .call(xAxis)
				        ; 
                }
          
               
            } //end showViewersSerie
        }        
            function showViewersSeason(d,i,l){
            	currentSeason=i;
            	currentSeasonlong=d;
	            
            
	           //updating sidebar
			            /*
d3.select("#currentSeason").text("Season "+(i+1));
			            
			        format = d3.time.format("%m/%d/%y");
                    var seasonsYear=format.parse(ep_data.seasons[i][l].airdate);
                    var yearNameFormat = d3.time.format("%Y");
                    seasonsYear=yearNameFormat(seasonsYear);
			            d3.select("#seasonYear").text(seasonsYear+" | ")
			            d3.select("#epInSeason").text(ep_data.seasons[i].length+" episodes")
			            d3.select("#prevSeason").style("display","inline")
			            d3.select("#nextSeason").style("display","inline")
			            if(i==0){
				            d3.select("#prevSeason").style("display","none")
			            }
			            if(i+1==ep_data.seasons.length){
				            d3.select("#nextSeason").style("display","none")
			            }
			            d3.select("#prevSeason").on("click",function () {
			            	i--;
			            	check(d,i,l);   
			            })
			            d3.select("#nextSeason").on("click",function () {
			            	i++;
			            	check(d,i,l);      
			            });
*/
			            
			            //removing old chart
			            d3.select("path.viewers").remove();
			            d3.selectAll("circle.viewers").remove();
			            d3.select("g.xAxis").remove();
			            
			             //creating season graph
			             scaleX = d3.scale.linear().domain([1, ep_data.seasons[i].length]).range([padding, w-padding]);
				         //scaleYr = d3.scale.linear().domain([0, 35]).range([h-padding, padding]);
				         
				         var xAxis = d3.svg.axis()
				                .scale(scaleX)
				                .orient("bottom")
				                ;           
		                    
		                    var lineFunction = d3.svg.line()
								.x(function(m,n) { return scaleX(n+1) })
								.y(function(m,n) { return scaleYr(ep_data.seasons[i][n].viewers)})
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
			             svg.selectAll("circle.viewers")
			               .data(ep_data.seasons[i])
			               .enter()
			               .append("circle")
			               .attr("fill","white" )
			               .attr("class","viewers")
			               .attr("stroke","#75c0e5")
			               .attr("stroke-width",2)
			               .attr("r", 5)
			               .attr("cx", function(m,n){return scaleX(n+1); } )
			               .attr("cy", function(m,n){return scaleYr(ep_data.seasons[i][n].viewers)})
			              
			               //adding tooltip
			               .on("mouseover", function(m,n){return tooltip
							.style("visibility","visible")
							.style("top","20px").style("left","400px")
							.text("Episode "+(n+1)+" "+ep_data.seasons[i][n].viewers+"M viewers")
							;
							})
							.on("mousemove", function (){ return tooltip.style("top",
                (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px"); })
							.on("mouseout", function(m,n){return tooltip.style("visibility","hidden")});
							
			             if(d3.select("g.xAxis").empty()){
	                           svg.append("g")
	                           .attr("class", "axis xAxis")  //Assign "axis" class
				            .attr("transform", "translate(0," + (h - padding) + ")")
				            .call(xAxis)
				            ; 
                            }
				  }
  //-----------------------------------------------------END VISUALIZE VIEWERS-------------------------------------------------------       
         
        
        // -----------------------------------FIN D3 AUDIENCE--------------------------------------------
      }
  });
  // Our module now returns our view
  return AudienceView;
});