function VGSentimentHub(campaignUid, networkSettings){
    this.campaignUid = campaignUid;
    this.networkSettings = $.extend({}, networkSettings);
    
    this.tags = campaignInfo['tags'];
    
    this.fetchedData = [];
    this.fetchedDataByType = {};
    this.fetchedDataByNetwork = {};
}

VGSentimentHub.prototype = $.extend(new Component(), {
    init: function(){
        
    },
    findClipByUid: function(uid){
        return $.grep(this.fetchedData, function(x){return x.id==uid? x : null})[0];
    },
    markDataItemAsUsed: function(item){
        item['_used'] = parseInt(new Date().getTime()/(1000*2)); // grouping content every 2 seconds
        if (item['type']){
            var i = $.inArray(item, this.fetchedDataByType[item.type]);
            if (i>=0){
                this.fetchedDataByType[item.type].push(
                    this.fetchedDataByType[item.type].splice(i, 1)[0]
                );
            }
            i = $.inArray(item, this.fetchedDataByNetwork[item.network]);
            if (i>=0){
                this.fetchedDataByNetwork[item.network].push(
                    this.fetchedDataByNetwork[item.network].splice(i, 1)[0]
                );
            }
        }
        return item;
    },
    resetUsedItems: function(){
        for (var item in this.fetchedData){
            this.fetchedData[item]['_used'] = 0;
        }
    },
    /**
     * This function returns one of the following whichever could be found:
     *      - An unused item of preferredType (if specified)
     *      - An unused item of type
     *      - If backfill=true, first unused item in video, photo, text order
     **/
    getRandomUnusedItemByType: function(type, validationFunc){
        if (!this.fetchedDataByType[type]) return null;
        var _firstUsedMark,
            key, 
            len = this.fetchedDataByType[type].length;
            
        for (var i = 0; i < len; i++){
            _firstUsedMark = this.fetchedDataByType[type][i]['_used'];
            key = Math.floor(Math.random() * (len-i));
            while (this.fetchedDataByType[type][key+i]['_used']!=_firstUsedMark){
                key = Math.floor(Math.random() * key);
            }
            if (!validationFunc || validationFunc(this.fetchedDataByType[type][key+i])) 
                return this.fetchedDataByType[type][key+i];
        }
        return null;
    },
    getUnusedItemByType: function(type, preferredType, backfill, blockedType, validationFunc){
        var backfillOrder = ['video', 'photo', 'text'];
        var data = null;

        var items = [], item;
        // the fetched data is always sorted by unused items first...
        if (preferredType && this.fetchedDataByType[preferredType]){
            item = this.getRandomUnusedItemByType(preferredType, validationFunc);
            if (item) items.push(item);
        }
        if (this.fetchedDataByType[type]){
            item = this.getRandomUnusedItemByType(type, validationFunc);
            if (item) items.push(item);
        }
        
        if (backfill){
            for (var i=0; i<backfillOrder.length; i++){
                var _type = backfillOrder[i];
                if ((!blockedType || _type != blockedType) && this.fetchedDataByType[_type]){
                    item = this.getRandomUnusedItemByType(_type, validationFunc);
                    if (item) items.push(item);
                }
            }
        }
        
        if (items && items.length>0){
            // if our first pick has never been used, just return it...
            if (items[0]['_used']==0) {
                return items[0];
            }else{
                // otherwise sort by least used item out of the bunch we handpicked and return the first one...
                return items.sort(function(a,b){return parseInt(a['_used'])-parseInt(b['_used'])})[0];
            }
        }
        return null;
    },
    getMoreItemByType: function(type){
        if (this.fetchedDataByType[type]){
            return this.fetchedDataByType[type][0];
        }
        return null;
    },
    fetch: function(){
        var _this = this;
        if (!this.trigger('Fetch')) return;
        
        for(var network in this.networkSettings){
            var fetchFunc = this['fetch'+network];
            var settings = this.networkSettings[network];
            var count = settings['count'] || 0;
            if (typeof(fetchFunc) == 'function' && count > 0){
                // fetch count keeps track of how many fetch functions are outstanding (waiting to be done)
                this._fetchCount = (this._fetchCount||0)+1;
                fetchFunc.call(this, count, settings, function(data, args){
                    var network = args[0];
                    if (data){
                        for(var i=0; i<data.length; i++){
                            data[i]['network'] = network;
                            data[i]['_used'] = 0;
                            if (_this.fetchedDataByNetwork[data[i].network]){
                                _this.fetchedDataByNetwork[data[i].network].unshift(data[i]);
                            }else{
                                _this.fetchedDataByNetwork[data[i].network] = [data[i]];
                            };
                            if (data[i].type){
                                if (_this.fetchedDataByType[data[i].type]){
                                    _this.fetchedDataByType[data[i].type].unshift(data[i]);
                                }else{
                                    _this.fetchedDataByType[data[i].type] = [data[i]];
                                };
                            }
                        }
                        _this.fetchedData = _this.fetchedData.concat(data);
                    }
                    
                    if (_this.trigger(network, data)){
                        _this.trigger('Data', network, data);
                    }

                    _this._fetchCount--;
                    if (_this._fetchCount<=0){
                        _this.trigger('Done', _this.fetchedData);
                    }
                }, [network]);
            }
        }
    },
    fetchTwitter: function(count, settings, callback, callbackArgs){
        this._fetchSentimentHub('Twitter', count, settings, callback, callbackArgs);
    },
    fetchInstagram: function(count, settings, callback, callbackArgs){
        this._fetchSentimentHub('Instagram', count, settings, callback, callbackArgs);
    },
    fetchYoutube: function(count, settings, callback, callbackArgs){
        this._fetchSentimentHub('Youtube', count, settings, 
            function(posts, callbackArgs){
                $.each(posts, function(i, x){
                    x['clipLink'] = '//www.youtube.com/embed/'+x.realId;
                });
                callback(posts, callbackArgs);
            }, 
            callbackArgs);
    },
    _fetchSentimentHub: function(network, count, settings, callback, callbackArgs){
        var url = '/api/v1.0/sentimenthub/'+this.campaignUid+'/'+network+'/posts/';

        var contentId;
        if ($.cookie("vgvidid") && $.cookie("vgvidid").indexOf('cvd_')!=0){
            contentId = $.cookie("vgvidid");
        }

        var params = {
            limit: count,
            contentId: contentId,
            tags: this.tags || settings.tags
        }

        if (!this.trigger('onSentimentHubParams', params, network, count, settings, callback, callbackArgs)) return;

        $.vgAjax({
            cache: true,
            type: 'GET',
            url: url,
            data: params,
            timeout: 10000,
            dataType: 'json',
            success: function(data, textStatus, XMLHttpRequest) {
                var posts = [];
                if (data.success) {
                    $.each(data.posts, function(i, x) {
                        posts.push($.extend(x, {
                            // any data overrides can go here...
                            clipType: 'content'
                        }));
                    });
                    callback(posts, callbackArgs);
                }else{
                    consoleLog("Failed to load "+network+" ["+data.errors[0]+"]");
                    callback([], callbackArgs);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                consoleLog("Failed to load posts from " + network + ".");
                callback([], callbackArgs);
            }
        });
    },
    _getVGDefaultParams: function(settings){
        var params = {
            'page': settings.page || 1,
            'limit': settings.count,
            'tags': this.tags || settings.tags
        }
        if (settings.clipOrder) {
            params['order'] = settings.clipOrder;
        }
        if (settings.category) {
            params['category'] = settings.category;
        }
        if ($.cookie("vgvidid") && $.cookie("vgvidid").indexOf('cvd_')==0){
            params['firstVideoUid'] = $.cookie("vgvidid");
        }
        return $.extend(params, settings.fetchParams || {});
    },
    fetchPhoto: function(count, settings, callback, callbackArgs){
        this._fetchVGAsset('photo', count, settings, callback, callbackArgs);
    },
    fetchVGVideo: function(count, settings, callback, callbackArgs){
        this._fetchVGAsset('video', count, settings, callback, callbackArgs);
    },
    _fetchVGAsset: function(vgQueryType, count, settings, callback, callbackArgs){
        var _this = this;
        var params = $.extend(this._getVGDefaultParams(settings), vgQueryType=='photo'? {types: 'image'} : {});
        var url = '/api/v1.0/videos/' + this.campaignUid + "/";
        
        if (!this.trigger('onVGAssetParams', params, vgQueryType, count, settings, callback, callbackArgs)) return;

        consoleLog('vg asset fetch params:', params);
        $.vgAjax({
            cache: true,
            type: 'GET',
            url: url,
            data: params,
            timeout: 10000,
            dataType: 'json',
            success: function(data, textStatus, XMLHttpRequest) {
                var assets = [];
                if (data.success) {
                    $.each(data.videos, function(i, x) {
                        assets.push($.extend({
                            id: x.viewUid,
                            clipType: x.clipType,
                            type: vgQueryType,
                            profilePic: x.fbUid? 'http://graph.facebook.com/'+x.fbUid+'/picture?type=large' : '',
                            contribName: (x.cnFirst?x.cnFirst.substr(0,1)+'. ':'')+x.cnLast,
                            thumb: x.thumb,
                            thumbLarge: x.thumbLarge,
                            image: x.thumbLarge,
                            playerHtml: '<img src="'+x.thumbLarge+'" data-uid="'+x.viewUid+'" />',
                            textHtml: x.text || x.cnTextResponse,
                            text: x.text || x.cnTextResponse,
                            shareUrl: x.shareUrl,
                            numVotes: x.numVotes,
                            viewUid: x.viewUid
                        }, vgQueryType!='photo'? x : {}));
                    });
                    callback(assets, callbackArgs);
                }else{
                    callback([], callbackArgs);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                consoleLog("Failed to load vg asset.");
                callback([], callbackArgs);
            }
        });
    },
    playContent: function(uid){
        var clip = sentimentHub.findClipByUid(uid);
        if (clip){
            player.play(clip, true);
        }else{
            console.error('Invalid Clip ID!');
        }
    }
});