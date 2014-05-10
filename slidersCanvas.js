var Sliders = {
    
    maxStageWidth: 2000,
    maxStageHeight: 500,
    maxPageWidth: 2000,
      
    addStage: function(container) {
      // console.log(this.container);

      // Check to see if window is less than desired width and calls sizing functions
      var setStageWidth = function () {
        if (window.innerWidth < this.maxPageWidth) {
          resizeStage();

        } else {

          maxStageSize();

        }
      };
      // Sets scale and dimensions of stage in relation to window size
      var resizeStage = function () {

        var scalePercentage = window.innerWidth / maxPageWidth;

        stage.setAttr('scaleX', scalePercentage);
        stage.setAttr('scaleY', scalePercentage);
        stage.setAttr('width', maxStageWidth * scalePercentage);
        stage.setAttr('height', maxStageHeight * scalePercentage);
        stage.draw();
      };

      //Sets scale and dimensions of stage to max settings
      var maxStageSize = function() {
        stage.setAttr('scaleX', 1);
        stage.setAttr('scaleY', 1);
        stage.setAttr('width', this.maxStageWidth);
        stage.setAttr('height', this.maxStageHeight);
        stage.draw();
      };
      //global variable.. fix this
      stage = new Kinetic.Stage({
        container: document.getElementById('sliders'),
        width: this.maxStageWidth,
        height: this.maxStageHeight,
        scaleX: 1
      });

      // On load we set stage size based on window size
      setStageWidth();
      // On window resize we resize the stage size
      window.addEventListener('resize', this.setStageWidth);

},

    addItems: function(data){


    var imageURLs=[];  // put the paths to your images here
    var imgs=[];
    
    var imageLayer = new Kinetic.Layer();
    stage.add(imageLayer);
    
    for (var i=0; i < data.length; i++) {
      imageURLs.push(data[i].thumb);
    }

    var loadAllImages = function(callback){
        var imagesOK=0;
        for (var i=0; i<imageURLs.length; i++) {
            var img = new Image();
            // console.log(imageURLs[i].);
            img.src = imageURLs[i];
            imgs.push(img);
            img.onload = function(){
                imagesOK++;
                // console.log(imagesOK, imageURLs.length);
                if (imagesOK>=imageURLs.length ) {
                    console.log("ok", imagesOK, imageURLs.length);
                    callback();
                }
            };
            img.onerror = function() {
              console.log("not ok", imagesOK, imageURLs.length);
              //alert("image load failed");
              callback();
            };
            //img.crossOrigin="anonymous";
            
        }
    };

    var start = function (){
    // the imgs[] array holds fully loaded images
    // the imgs[] are in the same order as imageURLs[]
    // use the images now!

      var targetX = 0;

      for (var i = 0; i < imgs.length; i++) {

        if ((imgs[i].naturalWidth > 0) && (imgs[i].naturalHeight > 0)) {
          addKineticImage(imgs[i], targetX, 10, 100, 75);
          targetX = targetX+100+10;
        }
      }
    };

    loadAllImages(start);
    var addKineticImage = function (myImage,x,y,w,h){
        // console.log(myImage);
        var image = new Kinetic.Image({
            x:x,
            y:y,
            width:w,
            height:h,
            image:myImage
            // draggable: false
        });
        imageLayer.add(image);
        imageLayer.draw();
    };

    console.log(imageLayer.getChildren());

    // console.log(imgs);;

        // stage.draw();



          
      //   var imageLayer = new Kinetic.Layer();
      // for (var i=0; i < data.length; i++) {
      //   // console.log(stage);

      //   var img = new Image();
      //   img.src = data[i].thumb;
      //   img.onload = function() {
      //     var imageItem = new Kinetic.Image({
      //       id: "image" + i,
      //       x: stage.getWidth() / 2,
      //       y: stage.getHeight() / 2,
      //       stroke: 'black',
      //       strokeWidth: 2,
      //       fill: 'red',
      //       image: img
      //     });
        
      //     imageLayer.add(imageItem);
      //     stage.add(imageLayer);
          
      //     var shapes = stage.find('image23');
      //     // console.log(shapes);

      //     var tween = new Kinetic.Tween({
      //       node: shapes,
      //       x: 100,
      //       y: 100,
      //       easing: Kinetic.Easings.BackEaseOut,
      //       onFinish: console.log("yup")
      //     });
        
      //     setTimeout(function() {
      //       tween.play();
      //     }, 1000);
      //   };
      // }
      //   console.log(stage.getChildren());
    },

    init: function(container){
        Sliders.container = container;
        // console.log(Sliders.container);
        Sliders.addStage();
        sentimentHub.on('Data', Sliders.onData);
        sentimentHub.on('Done', Sliders.onDataDone);
        sentimentHub.fetch();
    },
    
    // Triggered when data for a particular network is available
    onData: function(network, data){
        
        $.each(data, function(key, item){
            // Accordion.drawItem(network, item);            
            //Sliders.addItem(network, item);
            // let the library know we have used this item
            // sentimentHub.markDataItemAsUsed(item);
            
            // Accordion.playIfShared(item);
        });
        //Accordion.getLayers(stage);
    },
    
    // Triggered when we are done fetching data
    onDataDone: function(data){
        
    //console.log(data);
    Sliders.addItems(data);
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
        var $networkDiv = $("."+network, Accordion.$container);
        if ($networkDiv.length < 1)
            $networkDiv = $("<div></div>").addClass("network").addClass(network)
                .append($("<h2></h2>").html(network))
                .appendTo(Accordion.$container);
        
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
    }
}
