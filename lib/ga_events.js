// Module contains functionality to send custom events to the Google Analytics.
// Require Google Analytics code to be loaded.

function GAEvents(ga_vars) {
  var self = this;
  this.ga_vars = ga_vars;
  this.eventStack = {};
  this.eventStack[GAEvents.PRIORITY_HIGH] = [];
  this.eventStack[GAEvents.PRIORITY_LOW] = [];
  this._lastEventKey = null;
  this._numEventsSent = 0;
}
GAEvents.PRIORITY_HIGH=0;
GAEvents.PRIORITY_LOW=1;

GAEvents.videoPlayerSplashUids = {};
GAEvents.videoGallerySplashUids = {};

// Return a unique module name by concatenation of the real module title ("Web
// Gallery", "Recorder", etc.) and module type: "fb", "site".
function compose_mod_name(mod_type, orig_mod_name) {
  return mod_type + ':' + orig_mod_name;
}

// main function to handling sending of the events to GA
GAEvents.prototype.sendEvent = function(){
    var self = this;

    // allow one event every 1100ms
    var dt = "k"+Math.round(new Date().getTime()/(1100),2);

    // first 10 events seem to be free but use scheduling afterwards...
    if (self._numEventsSent>=10 && self._lastEventKey && self._lastEventKey == dt){
        setTimeout(function(){ self.sendEvent.call(self) }, 100);
        return;
    }

    var event = self.eventStack[GAEvents.PRIORITY_HIGH].length>0? self.eventStack[GAEvents.PRIORITY_HIGH].shift() :
                (self.eventStack[GAEvents.PRIORITY_LOW].length>0? self.eventStack[GAEvents.PRIORITY_LOW].shift() : null);
                
    if (event){
        //console.log("sending ", event[2]);
        self._numEventsSent++;
        self._lastEventKey = dt;
        _gaq.push(event);
    }
}

// schedule events to go out to google serially so that GA doesn't rate limit the events...
GAEvents.prototype.pushEvent = function(category, action, label, n, priority){
    var self = this;
    
    self.eventStack[priority || GAEvents.PRIORITY_HIGH].push(['_trackEvent', category, action, label, n || 1]);
    self.sendEvent();
}

// iFrame loaded.
GAEvents.prototype.moduleLoaded = function(mod_name, mod_type) {
  mod_name = mod_name || 'stub';
  _gaq.push(['_trackEvent', 'module', 'loaded',
             compose_mod_name(mod_type, mod_name), 1]);
}

// Video Share Referral
GAEvents.prototype.shareReferral = function(target_type, videoUid) {
  this.pushEvent('video', 'referral:' + target_type, videoUid, 1);
}

// Video impression on the page.
GAEvents.prototype.videoPlayerSplash = function(videoUid) {
  // send splash event once for each video / page
  if (!GAEvents.videoPlayerSplashUids[videoUid]){
    GAEvents.videoPlayerSplashUids[videoUid] = true;
    this.pushEvent('video', 'player:splash', videoUid, 1, GAEvents.PRIORITY_LOW);
  }
}

// Video started.
GAEvents.prototype.videoStart = function(videoUid) {
  this.pushEvent('video', 'player:started', videoUid, 1);
  try{
  self.ga_vars.addVideoToCookie(videoUid);
  }catch(e){console.log('error', e)}
}

// Video shared by email.
GAEvents.prototype.videoEmailShared = function(videoUid) {
  _gaq.push(['_trackSocial', 'email', 'shared', videoUid]);
  this.pushEvent('video', 'shared:email', videoUid, 1);
}

// Video shared by email.
GAEvents.prototype.videoGoogleShared = function(videoUid) {
  _gaq.push(['_trackSocial', 'google', 'shared', videoUid]);
  this.pushEvent('video', 'shared:google', videoUid, 1);
}

// Video liked on facebook.
GAEvents.prototype.videoFbLiked = function(videoUid) {
  _gaq.push(['_trackSocial', 'facebook', 'like', videoUid]);
  this.pushEvent('video', 'like:facebook', videoUid, 1);
}

// Video unliked.
GAEvents.prototype.videoFbUnLiked = function(videoUid) {
  _gaq.push(['_trackSocial', 'facebook', 'unlike', videoUid]);
  this.pushEvent('video', 'unlike:facebook', videoUid, 1);
}

// Video shared on facebook.
GAEvents.prototype.videoFbShared = function(videoUid) {
  _gaq.push(['_trackSocial', 'facebook', 'send', videoUid]);
  this.pushEvent('video', 'shared:facebook', videoUid, 1);
}

// Video tweeted.
GAEvents.prototype.videoTwitted = function(videoUid) {
  _gaq.push(['_trackSocial', 'twitter', 'tweet', videoUid]);
  this.pushEvent('video', 'shared:twitter', videoUid, 1);
}

// Video tweeted.
GAEvents.prototype.videoVote = function(videoUid) {
  this.pushEvent('video', 'vote', videoUid, 1);
}

// Video play.
// play_time - number of seconds after previous play_time event.
GAEvents.prototype.videoPlaying = function(videoUid, play_time) {
  this.pushEvent('video', 'player:play_time', videoUid, play_time);
}

// Video CTA url shown
GAEvents.prototype.videoCTASplash = function(videoUid) {
  this.pushEvent('video', 'player:ctaSplash', videoUid, 1);
}

// Video CTA url click
GAEvents.prototype.videoCTAClick = function(videoUid) {
  this.pushEvent('video', 'player:ctaClick', videoUid, 1);
}

// Video paused.
GAEvents.prototype.videoPause = function(videoUid) {
  this.pushEvent('video', 'player:paused', videoUid, 1);
}

// Video finished playing.
GAEvents.prototype.videoFinish = function(videoUid) {
  this.pushEvent('video', 'player:finished', videoUid, 1);
}

// Video completion percentage.
GAEvents.prototype.videoCompletionPercent = function(videoUid, percent) {
  this.pushEvent('video', 'player:' + percent + '%', videoUid, 1);
}

GAEvents.prototype.videoGallerySplash = function(videoUid) {
  // send splash event once for each video / page
  if (!GAEvents.videoGallerySplashUids[videoUid]){
    GAEvents.videoGallerySplashUids[videoUid] = true;
    this.pushEvent('video', 'gallery:splash', videoUid, 1, GAEvents.PRIORITY_LOW);
  }
}

GAEvents.prototype.videoGalleryPlay = function(videoUid) {
  this.pushEvent('video', 'gallery:play', videoUid, 1);
}


// Recording events.
GAEvents.prototype.recordPage = function(page) {
  this.pushEvent('recording', 'page', page, 1);
}

GAEvents.prototype.recordNeedHelp = function(page) {
  this.pushEvent('recording', 'need_help', page, 1);
}


// Recorder flash loaded
GAEvents.prototype.recorderLoaded = function(recordPlatform, recordOpType) {
  this.pushEvent('recording', 'loaded', recordPlatform + ":" + recordOpType, 1);
}

// Recording started
GAEvents.prototype.startRecording = function(recordPlatform, recordOpType) {
  this.pushEvent('recording', 'started', recordPlatform + ":" + recordOpType, 1);
}

// Recording started
GAEvents.prototype.recording = function(recordPlatform, recordOpType) {
  this.pushEvent('recording', 'record_time', recordPlatform + ":" + recordOpType, 1);
}

// Recording stopped
GAEvents.prototype.stopRecording = function(recordPlatform, recordOpType) {
  this.pushEvent('recording', 'stopped', recordPlatform + ":" + recordOpType, 1);
}

// Video is re-recorded
GAEvents.prototype.recordPreview = function(recordPlatform, recordOpType) {
  this.pushEvent('recording', 'preview', recordPlatform + ":" + recordOpType, 1);
}

// Video is re-recorded
GAEvents.prototype.reRecord = function(recordPlatform, recordOpType) {
  this.pushEvent('recording', 'rerecord', recordPlatform + ":" + recordOpType, 1);
}

// Recorded video acceptted by user
GAEvents.prototype.recordingDone = function(recordPlatform, recordOpType) {
//  _gaq.push(['_trackPageview']);
  this.pushEvent('recording', 'done', recordPlatform + ":" + recordOpType, 1);
}

// Recorded thumbnail menu 
GAEvents.prototype.selectThumb = function(recordPlatform, recordOpType) {
//  _gaq.push(['_trackPageview']);
  this.pushEvent('recording', 'select_thumb', recordPlatform + ":" + recordOpType, 1);
}

// Recorded thumbnail selected
GAEvents.prototype.thumbSelected = function(recordPlatform, recordOpType) {
//  _gaq.push(['_trackPageview']);
  this.pushEvent('recording', 'thumb_selected', recordPlatform + ":" + recordOpType, 1);
}


// Recorded video submitted
GAEvents.prototype.recordingSubmit = function(recordPlatform, recordOpType) {
//  _gaq.push(['_trackPageview']);
  this.pushEvent('recording', 'submit', recordPlatform + ":" + recordOpType, 1);
}

// Post record sharing
GAEvents.prototype.recordingShared = function(shareType, recordPlatform, recordOpType) {
  this.pushEvent('recording', 'shared:' + shareType, recordPlatform + ":" + recordOpType, 1);
}

GAEvents.prototype.uploadFileSelected = function(fileType, recordPlatform, recordOpType) {
    this.pushEvent('recording', 'selected_file:'+fileType, recordPlatform + ":" + recordOpType, 1);
}

// Upload transferred
GAEvents.prototype.uploadTransferred = function(recordPlatform, recordOpType) {
    this.pushEvent('recording', 'transferred', recordPlatform + ":" + recordOpType, 1);
}

// User Authorize Camera
GAEvents.prototype.camAuthorize = function(cam, recordPlatform, recordOpType) {
  this.pushEvent('recording', 'camauthorize', recordPlatform + ":" + recordOpType + ":" + cam, 1);
}

// User Authorize Microphone
GAEvents.prototype.micAuthorize = function(mic, recordPlatform, recordOpType) {
  this.pushEvent('recording', 'micauthorize', recordPlatform + ":" + recordOpType + ":" + mic, 1);
}

// User camera Disallow
GAEvents.prototype.camDisallow = function(recordPlatform, recordOpType) {
  this.pushEvent('recording', 'camdisallow', recordPlatform + ":" + recordOpType, 1);
}

// Conversion page loaded
GAEvents.prototype.converted = function() {
  this.pushEvent('conversion', 'converted', self.ga_vars.getCookieVideos(), 1);
  self.ga_vars.clearCookieVideos();
}

// Twitter Banner Before Init
GAEvents.prototype.twitterBeforeInit = function() {
  this.pushEvent('twitter', 'beforeinit', '', 1);
}

// Twitter Banner After Init
GAEvents.prototype.twitterAfterInit = function() {
  this.pushEvent('twitter', 'afterinit', '', 1);
}

// Twitter Banner Intend To Post
GAEvents.prototype.twitterIntendToPost = function() {
  this.pushEvent('twitter', 'intendtopost', '', 1);
}

// Twitter Banner Cancel Post
GAEvents.prototype.twitterCancelPost = function() {
  this.pushEvent('twitter', 'cancelpost', '', 1);
}

// Twitter Banner Post Successful
GAEvents.prototype.twitterPost = function() {
  this.pushEvent('twitter', 'post', '', 1);
}

// Twitter Banner Post Failed
GAEvents.prototype.twitterPostFail = function() {
  this.pushEvent('twitter', 'postfail', '', 1);
}

GAEvents.prototype.sboxContentSplash = function(network, id){
    this.pushEvent('storybox', 'splash:' + network, id, 1, GAEvents.PRIORITY_LOW);
}

GAEvents.prototype.sboxTrackEvent = function(metric, network, id) {
    //_gaq.push(['_trackEvent', 'storybox', metric + ':' + network, id, 1]);
    this.pushEvent('storybox', metric + ':' + network, id, 1);
}

GAEvents.prototype.sboxClickToPlay = function(network, id) {
    this.pushEvent('storybox', 'click:' + network, id, 1);
    try{ self.ga_vars.addVideoToCookie(id); } catch(e){ if (window['console'] && console.log) console.log('error', e) }
}

GAEvents.prototype.sboxTrackTime = function(metric, network, id, secs) {
    this.pushEvent('storybox', metric + 'Time:' + network, id, parseInt(secs) || 1);
}

GAEvents.prototype.sboxShare = function(network, id, shareTo) {
    this.pushEvent('storybox', 'share:' + network + "->" + shareTo, id, 1);
}

GAEvents.prototype.sboxShareReferral = function(network, id) {
    this.pushEvent('storybox', 'referral:' + network, id, 1);
}

GAEvents.prototype.sboxRecord = function(network, id, recordType) {
    this.pushEvent('storybox', (recordType? recordType : 'Record') + ':' + network, id, 1);
}

