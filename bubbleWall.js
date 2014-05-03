var Bubble = {
    $container: $("body"),
    
    init: function($container){
        // console.log('creating bubble');
        Bubble.$container = $container;
        sentimentHub.on('Data', Bubble.onData);
        sentimentHub.on('Done', Bubble.onDataDone);
        sentimentHub.fetch();
    },
    
    // Triggered when data for a particular network is available
    onData: function(network, data){

    },
    
    // Triggered when we are done fetching data
    onDataDone: function(data){
        // console.log('bubble on data done');
        // console.log(data);
        Bubble.drawBubbles(data);
    },
    
    playIfShared: function(item){
        var contentId = $.cookie("vgvidid");
        if (contentId && item.id == contentId){
            ga_events.sboxShareReferral(item.network, item.id);
            if (item.type != 'video'){
                player.hidePlayerMessage();
                player.play(item);
                ga_events.shareReferral('content:'+item.network, item.id);
                $.cookie("vgvidid", '', {
                    expires: 0,
                    domain: cookieDomain,
                    path: '/'
                });
            }
        }
    },
    
    // draw the items as desired
    drawItem: function(network, item){
      
        // For this example I am creating a separate network div for each network data and
        // append the items to the network div...
        // console.log('network', network);
        var $networkDiv = $("."+network, Example.$container);
        if ($networkDiv.length < 1)
            $networkDiv = $("<div></div>").addClass("network").addClass(network)
                .append($("<h2></h2>").html(network))
                .appendTo(Example.$container);
        
        // console.log("Item:", item);
        
        // create a div and attach the raw item data so we can use it to open the player popup on click
        var photo = item.image || item.thumb || item.profilePic;
        $networkDiv.append(
            $("<div></div>").addClass("item")
                .append(photo? $("<img />").attr({src: photo}) : '')
                .append($("<div></div>").addClass("info").html(item.text))
                .click(function(){
                    player.play(item);
                })
                .data({item: item})
        );
    },

    drawBubbles : function (data){
        
      var getInnerCircleIndex = function(d) {
        return "innerCircle" + d.index;
      };

      var urlInnerCircle = function(d) {
        return "url(#innerCircle" + d.index + ")";
      };

      var randomTimer = function() {
        return (Math.random()*5000);
      };


      var width = document.documentElement.clientWidth,
        height = 500,
        thumbr = 80, // this is the radius on width of thumbnails
        centerRadius = Math.min(width/2-thumbr, height/2-thumbr);

      var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "graph-svg-component");
        globalY=0;
          
      var getRowY = function() {
        if (globalY === 0) {
          globalY = 100;
        } else if (globalY === 100) {
          globalY = 200;
        } else if (globalY === 200) {
          globalY = 300;
        } else if (globalY === 300) {
          globalY = 400;
        } else if (globalY === 400) {
          globalY = 100;
        }
        return globalY;
      };

      var setCircleProperty = function(array, prop, value) {
        for (var i=0; i<array.length; i++) {
          if (prop === "color") {
            if (array[i]['network'] === "Youtube") {
              array[i]['color'] = "red";
            } else if (array[i]['network'] === "Twitter") {
              array[i]['color'] = "cyan";
            } else if (array[i]['network'] === "Instagram") {
              array[i]['color'] = "blue";
            } else if (array[i]['network'] === "VGVideo") {
              array[i]['color'] = "magenta";
            } else if (array[i]['network'] === "Photo") {
              array[i]['color'] = "green";
            }
          } else {
          array[i][prop] = value;
          }
        }
      };

      setCircleProperty(data, "cx", -100);
      
      for (var i=0; i<data.length; i++) {
        data[i]['cy'] = getRowY();
      }

      setCircleProperty(data, "radius", 50);
      setCircleProperty(data, "color", "color set within function");

      // console.log(data);

      var nodeGroup = svg.selectAll("svg")
        .data(data)
        .enter()
        .append("g")
        .attr("id", function(d) {return d.id; })
        .on("mouseover", function() {
          console.log(d3.selectAll("svg").attr("height"));
        d3.select(this).transition()
            //.style("fill", "white")
            // .attr("r", 300)
            // .transition()
            .attr("render-order", -1)
            .attr("transform", "translate(" + document.documentElement.clientWidth/2 + "," + (d3.selectAll("svg").attr("height")/2) + ")")
            .duration(2000)
            .delay(100)
            .transition()
            .attr("transform", "scale(100,100)")
            .duration(2000)
            .delay(100);
      });
      

      nodeGroup.append("circle")
        .attr("cx", function(d) { return d.cx; } )
        .attr("cy", function(d) { return d.cy; } )
        .attr("r", function(d) { return d.radius; } )
        .attr("id", function(d) { return d.id; } )
        .style("fill", function(d) { return d.color; } );

      nodeGroup.append("circle")
        .attr("cx", function(d) { return d.cx; } )
        .attr("cy", function(d) { return d.cy; } )
        .attr("r", function(d) { return d.radius-5; } )
        .style("fill", "black");
  
      nodeGroup.append("clipPath")
        .attr("id", function(d) { return "innerCircle" + d.index; })
        .append("circle")
        .attr("r", function(d) { return d.radius-5; } )
        .attr("cx", function(d) { return d.cx; } )
        .attr("cy", function(d) { return d.cy; } );


      nodeGroup.append("image")
        .attr("xlink:href", function(d) { return d.thumb; })
        .attr("clip-path", function(d) { return "url(#innerCircle" + d.index + ")";})
        .attr("x", function(d) { return d.cx-50 ; } )
        .attr("y", function(d) { return d.cy-50 ; } )
        .attr("width", 100)
        .attr("height", 100)
        .style("stroke", "black")
        .style("stroke-width", 1);
      
    
      // d3.selectAll("#cvd_65411721-2d68-4420-b592-93639568e11e")
      // .attr("cx", 1200);

// d3.selectAll(".cvd_65411721-2d68-4420-b592-93639568e11e")
//       .attr("cx", 1200);

      // d3.selectAll("*")
      // .attr("cx", 1200);

      var arrayMin = function( array ){
        return Math.min.apply( Math, array );
      };

      var moveRight = function(elementId) {
        //console.log(d3.select(elementId).attr("cy", function (d) { return d.cy; } )[0][0]['__data__']['cy']);
      //var abc = function (d) { return d; };
        d3.select(elementId).transition()
          //.each(cluster(10 * e.alpha * e.alpha))
          // .each(collide(0.5))
          // .attr("transform", "translate(" + function(d) { return d.cy; } + ",0)")
          .attr("transform", "translate(" + positioner(d3.select(elementId).attr("cy", function (d) { return d.cy; } )[0][0]['__data__']['cy']) + ",0)")
          // .style("fill", "white")
          // .attr("r", 80)
          // .attr("cx", 1200)
          //.attr("cy", function(d) { return d.cy ; })
          .duration(3000)
          .delay(randomTimer());
      };

      var positionsFilled = {};
      var positioner = function(y) {
        var x = 0;
        if (positionsFilled[y] === undefined) {
          positionsFilled[y] = [];
          x = document.documentElement.clientWidth+50;
          positionsFilled[y].push(x);
        } else {
          
          var ArrayMin = function(array) {
            return Math.min.apply( Math, array );
          };
          
          x = ArrayMin(positionsFilled[y]);
          x = x-100;
          positionsFilled[y].push(x);
          // console.log(y, positionsFilled[y]);
        }
        // console.log(positionsFilled[200]);
        return x;
      };

      var zoomIn = function(elementId) {
          d3.select(elementId)
          .attr("transform", "translate(" + positioner(d3.select(elementId).attr("cy", function (d) { return d.cy; } )[0][0]['__data__']['cy']) + ",0)")
          // .style("fill", "white")
          .attr("r", 200)
          // .attr("cx", 1200)
          //.attr("cy", function(d) { return d.cy ; })
          .duration(3000);
          // .delay(randomTimer());
      };

      for (var j=0; j<data.length; j++) {
        var searchClass = "#" + data[j].id;
        moveRight(searchClass);
      }
      
//       for (var j = 0 ; j < data.length; j++ ) {
//        searchClass = "." + data[j].id;
// //       console.log(searchClass);
//        var outerCircle = svg.selectAll(searchClass);
//         // .data(data)
//         // .enter()
        
//       outerCircle.append("circle")
//         .attr("cx", data[j].cx )
//         .attr("cy", data[j].cy )
//         .attr("r", data[j].radius )
//         .attr("id", data[j].id )
//         .style("fill", data[j].color );

//       }
    //   var innerCircle = nodeGroup.selectAll("circle")
    //     .data(data)
    //     .enter()
    //     .append("circle");

    //   var circleAttributes = innerCircle
    //     .attr("cx", function (d) { return d.cx; })
    //     .attr("cy", function (d) { return d.cy; })
    //     .attr("r", function (d) { return d.radius; })
    //     .attr("id", function(d) { return d.id; })
    //     .style("fill", "black");


    //     //   console.log(id);



    //   d3.select("#" + data[i].id).append("rect")
    //                         .attr("x", 10)
    //                         .attr("y", 10)
    //                         .attr("width", 50)
    //                         .attr("height", 100);        
    //   }


    // }



// function(d, i) { return i / n * duration; }



  }
};
            // var node = svg.selectAll("." + data[i].id)
            //   // .data(data)
            //   .enter()
            //   .attr("id", "group" + data[i].id)
            //   .attr("class", data[i].id);
            //   color = "#33CCFF";
              
            //   node.append("circle")
            //     .attr("class", data[i].id)
            //     .style("fill", networkColor(data[i].network))
            //     .attr("r", 45)
            //     .attr("cx", -10)
            //     .attr("cy", globalY);

            // node.append("circle")
            //     .attr("class", data[i].id)
            //     .style("fill", "black")
            //     .attr("r", 40)
            //     .attr("cx", -10)
            //     .attr("cy", globalY);

            // node.append("clipPath")
            //     .attr("class", data[i].id)
            //     // .attr("id", data[0]
            //     .append("circle")
            //     .attr("r", 40)
            //     .attr("cx", -10)
            //     .attr("cy", globalY);

            // //var groupId = "#group" + data[i].id;
            // node.append("image")
            //     .attr("class", data[i].id)
            //     //.attr("xlink:href", innerCircle(data[i].thumb))
            //     //.attr("clip-path", urlInnerCircle(data[i].thumb))
            //     .attr("x", -50)
            //     .attr("y", globalY-50)
            //     .attr("width", 100)
            //     .attr("height", 100);

          // }
            


// var circlesTransition = d3.selectAll(groupId)
   
//     });

//circlesTransition();

            // d3.select(this).append("text")
            //   .attr("dx", -20)
            //   .attr("dy", 30)
            //   .text(function(d) { return d.contribName; } );
          //});

          // node.on("click", function(d){
          //           player.play(d);
          //       });






    

