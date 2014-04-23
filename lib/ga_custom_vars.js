// This module contains a functionality to manage Google Analytics custom
// variables.
// Google analytics module should be loaded and _gaq var should exists in
// global scope.


var DEFAULT_LEVEL = 3;

function GAVars(clientName, clientUid, clientServeId, campaignUid, moduleUid, newUserUuid, cookieDomain) {
  this.clientName = clientName;
  this.clientUid = clientUid;
  this.clientServeId = clientServeId;
  this.campaignUid = campaignUid;
  this.moduleUid = moduleUid;
  this.cookieDomain = cookieDomain;
  
  // GA allows to set only 5 variables at the same time.
  this.slots = {
    client_name: 1, // client_name is always in slot #1
    client_uid: 2, // client_uid is always in slot #2
    campaign_uid: 3, // campaign uid is always in slot #3
    module_uid: 4, // module uid is always in slot #4
    user_uuid: 5 // user_uuid used for conversion tracking and tracking user behavior
  }
  this.vars = {};

  var userUuid, userUuidCookieName  = "user_uuid|"+clientServeId;
  if ($.cookie(userUuidCookieName)) {
    userUuid = $.cookie(userUuidCookieName);
  } else {
    userUuid = newUserUuid;
    $.cookie(userUuidCookieName, userUuid, {
      expires: 30,
      //domain: cookieDomain,
      path: '/'
    });
  }
  this.userUuid = userUuid;

  this.delAllVars();

  this.setModuleUid(moduleUid);
  this.setCampaignUid(campaignUid);
  this.setClientUid(clientUid);
  this.setClientName(clientName);
  this.setUserUuid(userUuid);
}

// Create custom variable with the given name, value and level
// and put it to a dedicated slot. Or if it's a new variable
// then put it to slot #5. If the optional parameter opt_update is true then
// the existing variable will be updated.
// Return number of slot.
GAVars.prototype.setVar = function(name, value, level, opt_update) {
  level = level || DEFAULT_LEVEL;
  if ((opt_update || false) && this.isVarSet(name)) {
    this.delVar(name);
  }

  var slot = this.slots[name] || 5;
  if (this.isVarSet(name)) {
    throw 'Variable already exists.';
  } else if (this.isSlotInUse(slot)) {
    throw 'Slot is already in use.'
  }
  this.vars[slot] = {
    name: name,
    value: value,
    level: level
  };
  _gaq.push(['_setCustomVar', slot, name, value, level]);
  return slot;
}

// Delete a variable with the given name. If name does not exist
// then throw an error.
GAVars.prototype.delVar = function(name) {
  var slot = this.slots[name] || 5;
  if (!this.vars.hasOwnProperty(slot)) {
    throw 'Variable does not exist.'
  }
  _gaq.push(['_deleteCustomVar', slot]);
  delete this.vars[slot];
}

GAVars.prototype.delAllVars = function() {
  var slot = 1;
  for (slot=1; slot<=5; slot++) {
    _gaq.push(['_deleteCustomVar', slot]);
    if (this.isSlotInUse(slot)) {
      delete this.vars[slot];
    }
  }
}

// Check if the variable with the given name is set.
GAVars.prototype.isVarSet = function(var_name) {
  var slot = this.slots[var_name] || 5;
  if (this.vars.hasOwnProperty(slot)) {
    if (slot != 5 || slot == 5 && this.vars[slot].name == var_name) {
      return true;
    }
  }
  return false;
}

// Rturn true if the given slot is currently in use.
GAVars.prototype.isSlotInUse = function(slot) {
  return this.vars.hasOwnProperty(slot);
}

// Helper methods to set custom vars.
// Set client name.
GAVars.prototype.setClientName = function(client_name, opt_update) {
  this.setVar('client_name', client_name, 3, opt_update);
}

// Set client Uid.
GAVars.prototype.setClientUid = function(client_uid, opt_update) {
  this.setVar('client_uid', client_uid, 3, opt_update);
}

// Set campaign uid.
GAVars.prototype.setCampaignUid = function(uid, opt_update) {
  this.setVar('campaign_uid', uid, 3);
}

// Set campaign uid.
GAVars.prototype.setModuleUid = function(uid, opt_update) {
  this.setVar('module_uid', uid, 3);
}

// Set unique uid.
GAVars.prototype.setUserUuid = function(user_uuid) {
  this.setVar('user_uuid', user_uuid, 3);
}

// Add a video to the video cookie for conversion tracking
GAVars.prototype.addVideoToCookie = function(videoUid) {
  var videoUids = ($.cookie('plays|'+this.clientServeId) || '').replace(/(,$)|(,,)|(^,)/,'').split(',');
  var shortenedUid = videoUid.slice(-10);
  if (videoUids.indexOf(shortenedUid)<0){
      videoUids.unshift(shortenedUid);
      // store up to 10 video uid's in the cookie
      videoUids = videoUids.slice(0,10);
      $.cookie('plays|'+this.clientServeId, videoUids.join(','), {
        expires: 30,
        //domain: this.cookieDomain,
        path: '/'
      });
  }
}

GAVars.prototype.getCookieVideos = function() {
    var videoUids = $.cookie('plays|'+this.clientServeId) || '';
    return videoUids;
}

GAVars.prototype.clearCookieVideos = function() {
    $.cookie('plays|'+this.clientServeId, '', {
      expires: 30,
      //domain: this.cookieDomain,
      path: '/'
    });
}