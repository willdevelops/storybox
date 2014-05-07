var Accordion = {
    $container: $("body"),
    
    addStage: function() {
        //*fix needed - global var stage itemPtr
        
        itemPtr = 0;
        stage = new Kinetic.Stage({
            container: document.getElementById('accordionDiv'),
            width: 1000,
            height: 200
        });
    
        // var diagInfo = new Kinetic.Layer();
            
        // var text = new Kinetic.Text({
        //     x: 70,
        //     y: 300,
        //     fontFamily: 'Calibri',
        //     fontSize: 24,
        //     text: '',
        //     fill: 'black'
        // });

        // diagInfo.add(text);
        // stage.add(diagInfo);
            
        stage.getContainer().addEventListener('mousemove', function(evt) {

            var writeMessage = function(layer, message) {
                text.setText(message);
                layer.draw();
            };

            // var getChildren = function(element) {
            //     var children = element.getChildren();
            //     console.log(children);
            // };

            var rect = stage.getContainer().getBoundingClientRect();
            var message = 'Mouse position: ' + (evt.clientX-rect.left) + ',' + (evt.clientY-rect.top);
            
            // writeMessage(diagInfo, message);
                //console.log(stage.getChildren());
            // console.log(message);            
            var childLayer = stage.getChildren();



            var leftBoundaryPx = stage.getContainer().getBoundingClientRect().left; // good
            var rightBoundaryPx = Math.floor(stage.getContainer().getBoundingClientRect().right); //good
            var activeWidthPx = 200;
            
            var maxWidthPercentage = 1.00;
            var minWidthAvailablePercentage = 0.95;
            var totalWidthPx = rightBoundaryPx - leftBoundaryPx; //good
            var mouseLocationXPx = Math.floor(evt.clientX-rect.left); //good

            var maxTotalNonActiveWidthPx = ((totalWidthPx - activeWidthPx)/2)*minWidthAvailablePercentage;

            
            // var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y + "\n" + distanceBetweenPx;

            for (i=0; i<childLayer.length; i++) {

            // var nonActiveCenterXPx = childLayer.getBoundingClientRect().right - (myLi.getBoundingClientRect().right - myLi.getBoundingClientRect().left);
                var currentImageWidth = childLayer[i].children[0].getAttrs().width;
                var currentImageXpx = childLayer[i].children[0].getAttrs().x;

                //var distanceBetweenPx = Math.abs(mouseLocationXPx - nonActiveCenterXPx);

//             console.log(childLayer[i].getAbsolutePosition().x);

                childLayer[i].clip({
                    x: ((childLayer[i].clip().x)-20),
                    y:50,
                    width: totalWidthPx*.05,
                    height:400
                });

                     
                //childLayer[i].clipWidth(200);
            

        //     if (mouseLocationXPx > myLi.getBoundingClientRect().right) {
        //       // console.log();
        //       myLi.width(maxTotalNonActiveWidthPx/distanceBetweenPx);
        //     } else if (mouseLocationXPx < myLi.getBoundingClientRect().left) {
        //       myLi.width(maxTotalNonActiveWidthPx/distanceBetweenPx);
        //     } else if ((mouseLocationXPx > myLi.getBoundingClientRect().left) && (mouseLocationXPx < myLi.getBoundingClientRect().right)) {
        //       $("#liItem" + item.id).width("200px");
        //     }






            }

stage.draw();



        }, false);



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
      

        var imageObj = new Image();
        // imageObj.src = item.thumb;
        imageObj.src = item.thumb;

        imageObj.onload = function() {
       var imageLayer = new Kinetic.Layer({
            id: item.id,
            class: "thumbnail",
            width: 200,
            height: 200,
            clip: {
                x:((stage.getChildren().length)*200),
                y:50,
                width:200,
                height:400
            }

            //width: 200
            // offsetX: 100,
        });
 
            var imageThumb = new Kinetic.Image({
                image: imageObj,
                width: 200,
                x: ((stage.getChildren().length)*200),
                y: 50
               //height: 150
            });

        imageLayer.add(imageThumb);
        stage.add(imageLayer);
        itemPtr = itemPtr + 1;
        //console.log(imageLayer.get)
        };
        
        // stage.on('contentMousemove', function() {
        //     .rotate(10);
        //     layer.batchDraw();
        // });
    




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
