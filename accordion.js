var Accordion = {
    $container: $("body"),
    
    addAccordionItem: function(network, item){
        console.log(item);

        $("#accordion").append("<li class='accordionItem' id='item" + item.id + "''></li>");

        
        var theli = document.getElementById('item' + item.id);
                
        theli.style.backgroundImage = "url(" + item.thumb + ")";
        
        // var img = $('<img class="accordionItem" id="' + item.id + '">');
        // img.attr('src', item.thumb);
        // img.appendTo($('#item' + item.id));

        activeItem = $("#accordion li:first");
        $(activeItem).addClass('active');
        
        $("#accordion li").hover(function(){
            $(activeItem).animate({marginLeft: '0px', width: "50px"}, {duration:300, queue:false});
            $(this).animate({marginLeft: '50px',
    width:'175px'}, {duration:300, queue:false});
            activeItem = this;
        });
 

    },

    init: function($container){
        Accordion.$container = $container;
        
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
