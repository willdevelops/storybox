var Component = function(){
    this.events = {};
}
Component.prototype = {
    on: function(eventName, func){
        this.onPriority(eventName, func);
    },
    onPriority: function(eventName, func, priority){
        eventName = eventName.replace(/^on/,'');
        if (!this.events[eventName]) this.events[eventName] = [];
        if (typeof priority == 'undefined' || priority<0 || priority>this.events[eventName].length){
            priority = this.events[eventName].length;
        }
        this.events[eventName].splice(priority, 0, func);
    },
    trigger: function(eventName){
        //consoleLog("event: "+eventName);
        eventName = eventName.replace(/^on/,'');
        this.eventStatus = eventName;
        var args = Array.prototype.slice.call(arguments,1);

        var ret;
        
        // check for and run the internal class event handlers...
        if (typeof(this['on'+eventName])=='function'){
            try{
                ret = this['on'+eventName].apply(this, args);
                if (typeof ret != 'undefined' && !ret) return false;
            }catch(e){
                consoleLog(e);
            }
        }

        // call the user events...
        if (this.events[eventName]){
            for(var i=0; i<this.events[eventName].length; i++){
                if (typeof(this.events[eventName][i])=='function'){
                    try{
                        ret = this.events[eventName][i].apply(this, args);
                        if (typeof ret != 'undefined' && !ret) return false;
                    }catch(e){
                        consoleLog(e);
                    }
                }
            }
        }
        last_user_state = eventName + (args && args.length>0? ":" + args.join(",") : "");
        user_state = last_user_state + '\n' + user_state;
        
        return true;
    }
}