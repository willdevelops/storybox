var Bubble = {
    $container: $("body"),
    
    init: function($container){
        console.log('creating bubble');
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
        console.log('bubble on data done');
        console.log(data);
        Bubble.drawBubbles(data.slice(0,20));
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
        console.log('network', network);
        var $networkDiv = $("."+network, Example.$container);
        if ($networkDiv.length < 1) 
            $networkDiv = $("<div></div>").addClass("network").addClass(network)
                .append($("<h2></h2>").html(network))
                .appendTo(Example.$container);
        
        console.log("Item:", item);
        
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
        console.log('darwbubbles function');

        var width = 960,
            height = 500,
           thumbr = 80, // this is the radius on width of thumbnails
           centerRadius = Math.min(width/2-thumbr, height/2-thumbr);

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

         // var center = svg.append("circle")
         // .attr('cx', width/2)
         // .attr('cy', height/2)
         // .attr('r', centerRadius)
         // .attr('fill', 'black');

         // inject a first element that all nodes will link to
        data.unshift({});


        var force = d3.layout.force()
            .gravity(.3)
            .distance(50)
            .charge(-100)
            .size([width, height]);



       var centralLinks = [];
       var centralLinksDistances = [];
       for (var i = 1 ; i < data.length ; i++){
         centralLinks.push({source: data[0], target: data[i], distance: centerRadius});
         centralLinksDistances.push(centerRadius*2);
       }

       var contentLinks = [];
       var contentLinksDistances = [];
       for (var i = 1 ; i < data.length ; i++){
         for (var j = 1 ; j < data.length ; j++){
           contentLinks.push({source: data[i], target: data[j]});
           contentLinksDistances.push(120);
         }
       }


      // console.log(centralLinksDistances.concat(contentLinksDistances))

       // start should be called again whenever the nodes and links change again
       force.nodes(data)
           .links(centralLinks.concat(contentLinks))
           .linkDistance(function(link, index){
               if (link.source.index === 0) {
                 return centerRadius *4;
               } else {
                 return thumbr *4;
               }
           })
           .linkStrength(0.3)
           .start();


         var link = svg.selectAll(".link")
           .data(centralLinks)
           .enter().append("line")
           .attr("class", "link");



          var node = svg.selectAll(".node")
              .data(data)
            .enter().append("g")
              .attr("class", "node")
              .call(force.drag);
          
           
          
          color = "#33CCFF";
          node.append("circle")
              .style("fill", function(d) {
                if (d.network === "Youtube") {
                  return "red";
                } else if (d.network === "Twitter") {
                  return "cyan";
                } else if (d.network === "Instagram") {
                  return "blue";
                } else if (d.network === "VGVideo") {
                  return "magenta";
                } else if (d.network === "Photo") {
                  return "green";
                }
              })
              .attr("r", 45)
              .attr("cx", 0)
              .attr("cy", 0);

          node.append("circle")
              .style("fill", "black")
              .attr("r", 40)
              .attr("cx", 0)
              .attr("cy", 0);


          node.append("clipPath")
              .attr("id", function(d) { return "innerCircle" + d.index; })
              .append("circle")
              .attr("r", 40)
              .attr("cx", 0)
              .attr("cy", 0);

          node.append("image")
              .attr("xlink:href", function(d) { return d.thumb; })
              .attr("clip-path", function(d) { return "url(#innerCircle" + d.index + ")";})
              .attr("x", -50)
              .attr("y", -50)
              .attr("width", 100)
              .attr("height", 100);

          
          // node.on("mouseover", function() {
          //   d3.select(this).transition()
          //     .style("fill", "white")
          //     .attr("r", 40)
          //     .attr("cx", 0)
          //     .attr("cy", 0)
          //   .duration(1000)
          //   .delay(100);

            // d3.select(this).append("text")
            //   .attr("dx", -20)
            //   .attr("dy", 30)
            //   .text(function(d) { return d.contribName; } );
          //});

          // node.on("click", function(d){
          //           player.play(d);
          //       });


          force.on("tick", function() {
           link.attr("x1", function(d) { return d.source.x; })
               .attr("y1", function(d) { return d.source.y; })
               .attr("x2", function(d) { return d.target.x; })
               .attr("y2", function(d) { return d.target.y; });


           node.attr("cx", function(d) { 
             if (d.index === 0 ){
               return d.x = (width/2);
             } 
           });


           node.attr("cy", function(d) { 
             if (d.index === 0 ){
               return d.y = (height/2);
             }
           });





           node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
         });



        }




    };
