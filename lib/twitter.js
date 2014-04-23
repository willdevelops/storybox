var twitter = {
    auth_tokens: null,
    auth: function (successCallback, failCallback, authCallback) {
        if (twitter.auth_tokens){
            if(typeof successCallback == 'function') {
                successCallback(twitter.auth_tokens);
            }
            return;
        }
        
        // If we try to create the window after ajax returns, the popup blockers will prevent it from opening. So opening it ahead of time.
        window.twitter = twitter;
        twitter._twitLogin = window.open("about:blank", "TwitterSignIn","width=1,height=1");

        $.ajax({
            url: '/api/v1.0/sentimenthub/twitter/get_auth',
            type: 'GET',
            cache: false,
            dataType: 'json',
            data: {'protocol': window.location.protocol, 'domain': window.location.protocol + '//' + window.location.hostname + (window.location.port? ':'+window.location.port:'')},
            success: function (res) {
                if(res.url) {
                    var authFunc = function(){
                        twitter._successCallback = successCallback;
                        twitter._failCallback = failCallback;
                        twitter._twitLogin.resizeTo(700, 500);
                        twitter._twitLogin.location = res.url;
                        twitter._twitLogin.focus();
                        twitter._timer = setInterval(function() {   
                            if(!twitter._twitLogin || twitter._twitLogin.closed) {  
                                    clearInterval(twitter._timer);
                                    if(typeof failCallback == 'function'){
                                        failCallback();
                                    }
                                }  
                            }, 1000);  
                    }
                    if (typeof authCallback == 'function') {
                        authCallback(authFunc);
                    }else{
                        authFunc();
                    }
                } else {
                    twitter.auth_tokens = res.auth_tokens;
                    twitter._twitLogin.close();
                    if(typeof successCallback == 'function') {
                        successCallback(res.auth_tokens);
                    }
                }
            }
        });
    },
    authenticated: function(success,auth_tokens) {
        clearInterval(twitter._timer);
        if(success){
            twitter.auth_tokens = auth_tokens;
            if(typeof twitter._successCallback == 'function'){
                twitter._successCallback(auth_tokens);
            }
        }else{
            if(typeof twitter._failCallback == 'function'){
                twitter._failCallback();
            }
        }
    },
    // Post status to twitter...
    post: function (postValue, callback) {
        $.ajax({
            url: '/api/v1.0/sentimenthub/twitter/post',
            type: 'GET',
            cache: false,
            data: { 'post_val': postValue },
            dataType: 'json',
            success: function (res) {
                if(res && !res.success) {
                    consoleLog('Twitter Post Failed: ' + res.errors.toString());
                }
                if(typeof callback == 'function') {
                    callback(res && res.success);
                }
            }
        });
    },
    // Reply to a status to twitter...
    reply: function (postValue, id, callback) {
        // on test servers disable tweet reply communications except for the authenticated user's tweets...
        if (!window['enableCommunications'] && (!twitter.auth_tokens || postValue.indexOf("@"+twitter.auth_tokens.screen_name) < 0)){
            consoleLog("Faking the twitter reply...");
            if(typeof callback == 'function') {
                callback(true);
            }
            return;
        }
        $.ajax({
            url: '/api/v1.0/sentimenthub/twitter/post',
            type: 'GET',
            cache: false,
            data: { 'post_val': postValue, 'reply_to': id },
            dataType: 'json',
            success: function (res) {
                if(res && !res.success) {
                    consoleLog('Twitter Reply Failed: ' + res.errors.toString());
                }
                if(typeof callback == 'function') {
                    callback(res && res.success);
                }
            }
        });
    },
    send: function (userId, text) {
        $.ajax({
            url: '/api/v1.0/sentimenthub/twitter/send',
            type: 'GET',
            cache: false,
            data: { 'user_id': userId, 'text': text },
            dataType: 'json',
            success: function (res) {
                if(res && !res.success) {
                    consoleLog('Twitter Send Fail: ' + res.errors.toString());
                }
                if(typeof callback == 'function') {
                    callback(res && res.success);
                }
            }
        });
    },
    signout: function (callback) {
        $.ajax({
            url: '/api/v1.0/sentimenthub/twitter/signout',
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function (res) {
                if(res && !res.success) {
                    consoleLog('Twitter Signout Fail: ' + res.errors.toString());
                }
                twitter.auth_tokens = null;
                if(typeof callback == 'function') {
                    callback(res && res.success);
                }
            }
        });
    }
}
function TwitterBanner($container, campaignUid, bannerTimeout, maxCount) {
    var _self = this;
    function initBanner() {
        _self.trigger("BeforeInit");

        var twitterURL = "/api/v1.0/sentimenthub/" + campaignUid + "/twitter/posts/";
        $.ajax({
            cache: false,
            dataType: 'json',
            type: 'GET',
            url: twitterURL,
            data: {
                limit: maxCount || 10
            },
            success: function(res){
                if (_self.trigger("JSONSuccess", res) && res && res.success){
                    renderBanner(res);
                }else{
                    _self.trigger("JSONError", res);
                    consoleLog("Tweets API Failed!", res);
                    $('.tweetArea').hide();
                }
                _self.trigger("AfterInit", res);
            },
            error: function(res){
                _self.trigger("JSONError", res);
                consoleLog("Tweets API Failed!", res);
                $('.tweetArea').hide();
            }
        });
    }
    function renderBanner(res) {
        var twitterPostURL = "//twitter.com/intent/tweet?hashtags=" + res.hashtag.replace('#', '') + "&amp;tw_p=tweetbutton";

        $(".tweetShow a").attr('href', twitterPostURL);
        $(".hashtag").text(res.hashtag);

        $('.tweetBtn').click(function (e) {
            _self.trigger("SwitchToTweetPost");
            e.preventDefault();
            $('.tweetShow').hide();
            $('.tweetSubmit').fadeIn();
        });
        $('#backToTweets').click(function () {
            _self.trigger("BackToTweetView");
            $('.tweetSubmit').hide();
            $('.tweetShow').fadeIn();
        });
        var twitterTags = ' ' + res.hashtag + ' ' + moduleURL;
        $('#tweetInput').attr('maxSize', (140 - twitterTags.length));
        charCounter($('#tweetInput'), $('#tweetCounter'));

        $('#submitTweet').click(function () {
            _self.trigger("PreTwitterAuth");
            twitter.auth(function(res){
                _self.trigger("TwitterAuth");
                var twitterPost = $('#tweetInput').val() + twitterTags;
                twitter.post(twitterPost, function (success) {
                    if(success) {
                        _self.trigger("TwitterPost");
                        $('.tweetSubmit').hide();
                        $('#tweetFail').hide();
                        $('.tweetShow').fadeIn();
                        $('#tweetConfirm').fadeIn();
                    }else{
                        _self.trigger("TwitterPostFail");
                        $('.tweetSubmit').hide();
                        $('#tweetConfirm').hide();
                        $('.tweetShow').fadeIn();
                        $('#tweetFail').fadeIn();
                    }
                });
            });
        });

        $.each(res.posts, function(i,data) {
            $($container).append('<li><img src="' + data.profilePic + '" border="0" class="tweetImg" /><p><a href="//twitter.com/' + data.contribName + '" target="_blank" class="handle">&#64;' + data.contribName + '</a>: ' + data.text + '</p></li>');
        });
        _self.trigger("StartCycleTweets");
        $("li:first", $container).addClass('current').fadeIn();
        var intervalID = setInterval(cycleTweets, bannerTimeout);

        $('.tweetArea').mouseover(function () {
            _self.trigger("StopCycleTweets");
            clearInterval(intervalID);
        });
        $('.tweetArea').mouseout(function () {
            _self.trigger("StartCycleTweets");
            intervalID = setInterval(cycleTweets, bannerTimeout);
        });
    }
    function cycleTweets(){
        
        var onLastTweet = $("li:last", $container).hasClass("current"),
            currentTweet;

        if($("li.current", $container)[0]){
            currentTweet = $("li.current", $container);
        }else{
            currentTweet = $("li:first", $container);
            currentTweet.addClass('current').fadeIn();
        }
        
        if(onLastTweet){
            currentTweet.hide().removeClass("current");
            $("li:first", $container).addClass("current").fadeIn();
        }else{
            currentTweet.hide().removeClass("current").next().addClass("current").fadeIn();
        }
    };
    initBanner();
};
TwitterBanner.prototype = $.extend(new Component(), {
    onBeforeInit: function(){
        consoleLog("BeforeInit");
        ga_events.twitterBeforeInit();
    },
    onAfterInit: function(){
        consoleLog("AfterInit");
        ga_events.twitterAfterInit();
    },
    onSwitchToTweetPost: function(){
        consoleLog("SwitchToTweetPost");
        ga_events.twitterIntendToPost();
    },
    onBackToTweetView: function(){
        consoleLog("BackToTweetView");
        ga_events.twitterCancelPost();
    },
    onTwitterPost: function(){
        consoleLog("TwitterPost");
        ga_events.twitterPost();
    },
    onTwitterPostFail: function(){
        consoleLog("TwitterPostFail");
        ga_events.twitterPostFail();
    }
});
