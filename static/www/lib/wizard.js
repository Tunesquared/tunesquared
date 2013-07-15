/**
    Wizard.js -- A jquery plugin to easily create wizards
 */


(function(){
    // Private methods
    function showPage(ctx){
        var wiz = ctx.wizard;
        if(wiz.page == 0)
            wiz.b_prev.hide();
        else
            wiz.b_prev.show();
        if(wiz.page == wiz.pageCount -1){
            wiz.b_done.show();
            wiz.b_next.hide();
        } else {
            wiz.b_done.hide();
            wiz.b_next.show();
        }
        
        $(wiz.pages.hide().get(wiz.page)).show();
    }
    
    function move(d){
        var wiz = this.wizard;
            
        var evt = new Event();
        $(this).trigger('wiz_hide:'+wiz.page, evt);
        
        if(!evt.isCancelled()){
            if((wiz.page < wiz.pageCount -1 && d == 1) || (wiz.page > 0 && d == -1)){
                wiz.page += d;
            }
            showPage(this);
            $(this).trigger('wiz_show:'+wiz.page, new Event());
        }
    }

    function cancelEvtProxy(method, ctx){
        return function(evt){
            evt.preventDefault();
            method.apply(ctx, arguments);
        };
    }
    
    function done(){
        $(this).trigger('wiz_hide:'+this.wizard.page, new Event());
        $(this).trigger('wiz_done');
    }
    
    var Event = function(){
        var cancelled = false;
        this.cancel = function(){
            cancelled = true;
        }
        this.isCancelled = function(){
            return cancelled;
        }
    };
    
    // Exposed methods
    var methods = {
        init: function(){
            var el = $(this);
            
            if(typeof(this.wizard) === 'undefined'){
                this.wizard = {};
                this.wizard.b_prev = el.find('[data-role="prev"]').click(cancelEvtProxy(methods.prev, this));
                this.wizard.b_done = el.find('[data-role="done"]').click(cancelEvtProxy(done, this));
                this.wizard.b_next = el.find('[data-role="next"]').click(cancelEvtProxy(methods.next, this));
                this.wizard.b_cancel = el.find('[data-role="cancel"]');
            }
            
            this.wizard.pages = el.find('[data-role="page"]');
            
            this.wizard.pageCount = this.wizard.pages.length;
            this.wizard.page = 0;
            
            showPage(this, true);
            $(this).trigger('wiz_show:0');
        },
        
        next: function(){
            move.call(this, 1);
        },
        
        prev: function(){
            move.call(this, -1);
        }
    };
    
    $.extend($.fn, {
        wizard: function() {
            var callStack = [];
            if(arguments.length == 0) callStack.push('init');
            else if(typeof arguments[0] === 'string'){
                callStack.push(arguments[0]);
                if(arguments[0] !== 'init' && typeof this.wizard == 'undefined')
                    callStack.push('init');
            }
            
            return $(this).each(function(){
                while(callStack.length > 0){
                    methods[callStack.pop()].call(this);
                }
            });
        }
    });
    
})();