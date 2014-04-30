var Accordion = {
    $container: $("body"),

    // controlNode: function() {
    //     console.log($("#accordion").getChildren());

    // },
    
    addStage: function() {
  
    var li = $("#accordion").children("li");

    //console.log($("#accordion")[0].clientWidth);
    var i=0;
    var j=0;

    var sectorSize = $("#accordion")[0].clientWidth/li.length;
    var shrink = 0.03;
    var sector = 0;
    sector = li.length;
    var prevSize = 200;
    var percentage = 1;

    for (i=0; i<li.length; i++) {
        $(li[i]).css("left", i*sectorSize);
    }




    $( "#accordion" ).mousemove(function( event ) {
        for (i=0; i < li.length; i++) {

            var distanceBetweenPx = Math.abs(event.pageX - $(li[i]).css("left").replace(/[^-\d\.]/g, ''));
            percentage = distanceBetweenPx/1000;
            // $("#accordion")[0].clientWidth;
            totalHalfPx = $("#accordion")[0].clientWidth/2;
            minWidthPx = 10;
            maxWidthPx = 100;
            prevWidth = 0;

// Formula: y = a(1 -b)^x 
// y: Final amount remaining after the decay over a period of time (0)
// a: The original amount ()
// b: The decay factor
// x: Time (number of pics remaining)

                
//            $(li[i]).css("width", totalHalfPx((1-0.2)^distanceBetweenPx));
//console.log(totalHalfPx*((1-0.2)^distanceBetweenPx));
            var getWidth = $(li[i]).css("width").replace(/[^-\d\.]/g, '');
            var itemWidth = parseInt(getWidth, 10);
            
            $(li[i]).find("p").text( 1-( Math.pow(percentage,0.27) ) );
            // $(li[i]).css("width", 200);
            $(li[i]).css("width",  200*(1-( Math.pow(percentage,0.27) )) );

//console.log($(li[i]).css("left"));
                //$(li[i]).find("p").text("i'm smaller!");
            var getLeft = $(li[i]).css("left").replace(/[^-\d\.]/g, '');
            var itemLeft = parseInt(getLeft, 10);

//console.log(event.pageX, " <> ", $(li[i]).css("left").replace(/[^-\d\.]/g, ''));
            // if (event.pageX > itemLeft) {
            //     $(li[i]).find("p").text("i'm smaller!");
            //     $(li[i]).css("width", 100);
            //     j = i-1;
            //     while (j>=0){
            //         prevWidth = parseInt($(li[j+1]).css("width").replace(/[^-\d\.]/g, ''), 10);
            //         $(li[j]).css("width", prevWidth*0.3);
            //         // $(li[j]).css("left", prevWidth*0.8);

            //         j--;
            //     }
                
            // } 

            // if (event.pageX < itemLeft) {
            //     $(li[i]).find("p").text("i'm bigger!");
            //     $(li[i]).css("width", 100);
            //     j = i+1;
            //     while (j<li.length){
            //         prevWidth = parseInt($(li[j-1]).css("width").replace(/[^-\d\.]/g, ''), 10);
            //         $(li[j]).css("width", prevWidth*0.3);
            //         j++;
            //     }
            // }
        }










// Formula: y = a(1 -b)^x 
// y: Final amount remaining after the decay over a period of time (0)
// a: The original amount ()
// b: The decay factor
// x: Time (number of pics remaining)





//console.log(1-(Math.pow(200,1/distanceBetweenPx)/totalHalfPx));


// if (event.pageX < sectorSize*sector) {
//     sector = sector - 1;
// }
// prevSize = 200;
// for (i = sector; i < li.length; i++) {



// }
// prevSize = 200;
// for (i = sector; i > 0; i--) {
//     // prevSize = prevSize*shrink;
//     // $(li[i]).css("width", prevSize);
// }




  var msg = "Handler for .mousemove() called at ";
  msg += event.pageX + ", " + event.pageY;
  $( "#xy" ).text( "" + msg + "" );
});




        //*fix needed - global var stage itemPtr
        
//         itemPtr = 0;
//         stage = new Kinetic.Stage({
//             container: document.getElementById('accordionDiv'),
//             width: 1000,
//             height: 200
//         });
    
//         var diagInfo = new Kinetic.Layer();
            
//         var text = new Kinetic.Text({
//             x: 70,
//             y: 300,
//             fontFamily: 'Calibri',
//             fontSize: 24,
//             text: '',
//             fill: 'black'
//         });

//         diagInfo.add(text);
//         stage.add(diagInfo);
            
//         stage.getContainer().addEventListener('mousemove', function(evt) {

//             var writeMessage = function(layer, message) {
//                 text.setText(message);
//                 //layer.draw();
//             };

//             var rect = stage.getContainer().getBoundingClientRect();
//             var message = 'Mouse position: ' + (evt.clientX-rect.left) + ',' + (evt.clientY-rect.top);
            
//             writeMessage(diagInfo, message);
//             console.log(stage.getChildren());
//             console.log(message);
//             var childLayer = stage.getChildren();



//             var leftBoundaryPx = stage.getContainer().getBoundingClientRect().left; // good
//             var rightBoundaryPx = Math.floor(stage.getContainer().getBoundingClientRect().right); //good
//             var activeWidthPx = 200;
            
//             var maxWidthPercentage = 1.00;
//             var minWidthAvailablePercentage = 0.95;
//             var totalWidthPx = rightBoundaryPx - leftBoundaryPx; //good
//             var mouseLocationXPx = Math.floor(evt.clientX-rect.left); //good

//             var maxTotalNonActiveWidthPx = ((totalWidthPx - activeWidthPx)/2)*minWidthAvailablePercentage;

            
//             //message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y + "\n" + distanceBetweenPx;

// console.log(message);
// stage.draw();



//         }, false);



            // var mousePos = getMousePos(stage, evt);
            // var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
            // writeMessage(imageLayer, message);

        // function getStageMousePos(myElement, evt) {
          
        //   return {
        //         x: evt.clientX - rect.left,
        //         y: evt.clientY - rect.top,
        //         xMin: rect.left,
        //         yMin: rect.top,
        //         xMax: rect.right,
        //         yMax: rect.bottom
        //     };
        // }
    },



    addAccordionItem: function(network, item){


        var xSize = 300;
        // console.log(item);
            
        $("#accordion").append('<li><p></p><canvas style="width:'+xSize+'px;height:200px; border:1px solid black" id="canvas'+ item.id +'"/></li>');


        var img = new Image();
        img.src = item.thumb;
        img.onload = draw_image;

        function draw_image() {
            $('#canvas' + item.id).each(function(i){
                var context = this.getContext("2d");
                // context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
                context.drawImage(img, 0, 0, 300, 250);
//                context.font = "40pt Calibri";
//                context.fillStyle = "green";
//                context.fillText("text "+i, 30, 40);
            });
        }


        // function CircleMovetoMouse(){
        //  var mousePos = stage.getMousePosition();
        //  var xpos = mousePos.x;
        //  var ypos = mousePos.y ;

        

      //   var imageGroup = new Kinetic.Group({
      //   clip: {
      //     x: 100,
      //     y: 40,
      //     width: 200,
      //     height: 100
      //   },
      //   draggable: true
      // });
      

       //  var imageObj = new Image();
       //  // imageObj.src = item.thumb;
       //  imageObj.src = item.thumb;

       //  imageObj.onload = function() {
       // var imageLayer = new Kinetic.Layer({
       //      id: item.id,
       //      class: "thumbnail",
       //      width: 200,
       //      height: 200,
       //      // clip: {
       //      //     x:((stage.getChildren().length)*200),
       //      //     y:50,
       //      //     width:200,
       //      //     height:400
       //      }

       //      //width: 200
       //      // offsetX: 100,
       //  });
 
       //      var imageThumb = new Kinetic.Image({
       //          image: imageObj,
       //          width: 200,
       //          // x: ((stage.getChildren().length)*200),
       //          // y: 50
       //         //height: 150
       //      });

       //  imageLayer.add(imageThumb);
       //  stage.add(imageLayer);
       //  itemPtr = itemPtr + 1;
       //  //console.log(imageLayer.get)
       //  };
        
       //  // stage.on('contentMousemove', function() {
       //  //     .rotate(10);
       //  //     layer.batchDraw();
       //  // });
    




//////////////////////////
        // $("#accordion").append('<li class="accordionItem" id="liItem' + item.id + '"></li>');

        // var imgCanvas = document.createElement("canvas");
        // imgCanvas.id = 'canvasId' + item.id;
        
        // $("#liItem" + item.id).append(imgCanvas);

        // var myLi = document.getElementById("liItem" + item.id);
        // var myCanvas = document.getElementById("canvasId" + item.id);
        // var myContext = myCanvas.getContext("2d");
        // var myImg = new Image();
        // myImg.src = item.thumb;
        // myImg.onload = function() {
        //     myContext.drawImage(myImg, 0, 0);
        // };

        // var myAccordion = document.getElementById("accordionDiv");
        // myAccordion.addEventListener('mousemove', function(evt) {
        //     var mousePos = getMousePos(myAccordion, evt);
        //     writeMsg(mousePos.x);

        // });

        

        // var writeMsg = function(message) {
        //     $("#xy").text("<p>" + message + "</p>");
        // };

 
/////////////////////////////////////

        // myLi.addEventListener('mousemove', function(evt) {
        //     var myLi = document.getElementById("liItem" + item.id);
                
        //     var myAccordion = document.getElementById("accordionDiv");
        //     //var liLeft = myLi.getBoundingClientRect().left;


        //     var mousePos = getMousePos(myAccordion, evt);
      
        //     var leftBoundaryPx = myAccordion.getBoundingClientRect().left;
        //     var rightBoundaryPx = Math.floor(myAccordion.getBoundingClientRect().right);
        //     var activeWidthPx = 200;
        //     var nonActiveCenterXPx = myLi.getBoundingClientRect().right - (myLi.getBoundingClientRect().right - myLi.getBoundingClientRect().left);
            
                
        //     var maxWidthPercentage = 1.00;
        //     var minWidthAvailablePercentage = 0.95;
        //     //var nonActiveMinWidthPx = activeWidthPx * minWidthPercentage;
        //     //var nonActiveMaxWidthPx = activeWidthPx - nonActiveMinWidthPx;
        //     var totalWidthPx = rightBoundaryPx - leftBoundaryPx;
        //     var mouseLocationXPx = Math.floor(mousePos.x);

        //     var maxTotalNonActiveWidthPx = ((totalWidthPx - activeWidthPx)/2)*minWidthAvailablePercentage;

        //     var distanceBetweenPx = Math.abs(mouseLocationXPx - nonActiveCenterXPx);

        //     var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y + "\n" + distanceBetweenPx;
        //     writeMsg(message);

            

        //     if (mouseLocationXPx > myLi.getBoundingClientRect().right) {
        //       // console.log();
        //       myLi.width(maxTotalNonActiveWidthPx/distanceBetweenPx);
        //     } else if (mouseLocationXPx < myLi.getBoundingClientRect().left) {
        //       myLi.width(maxTotalNonActiveWidthPx/distanceBetweenPx);
        //     } else if ((mouseLocationXPx > myLi.getBoundingClientRect().left) && (mouseLocationXPx < myLi.getBoundingClientRect().right)) {
        //       $("#liItem" + item.id).width("200px");
        //     }

           
        // }, false);
       
//$(".accordionItem").width("100px");

        // myCanvas.addEventListener('mousemove', function(evt) {
        //     var mousePos = getMousePos(myCanvas, evt);
        //     var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        //     // console.log(message);
        // }, false);
        

    },

    init: function($container){
        Accordion.$container = $container;
        //console.log("Accordion.$container");
        
        sentimentHub.on('Data', Accordion.onData);
        sentimentHub.on('Done', Accordion.onDataDone);
        sentimentHub.fetch();
    },
    
    // Triggered when data for a particular network is available
    onData: function(network, data){

        $.each(data, function(key, item){
            // Accordion.drawItem(network, item);            
            Accordion.addAccordionItem(network, item);
            // let the library know we have used this item
            sentimentHub.markDataItemAsUsed(item);
            
            Accordion.playIfShared(item);
        });
        //Accordion.getLayers(stage);
    },
    
    // Triggered when we are done fetching data
    onDataDone: function(){
        
        Accordion.addStage();

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
        var $networkDiv = $("."+network, Accordion.$container)
        if ($networkDiv.length < 1)
            $networkDiv = $("<div></div>").addClass("network").addClass(network)
                .append($("<h2></h2>").html(network))
                .appendTo(Accordion.$container);
        
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
    }
}
