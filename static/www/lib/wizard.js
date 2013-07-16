/**
    Wizard.js -- A jquery plugin to easily create wizards
 */

/* jshint undef: false, strict: false, eqnull: true */
(function () {
    // Private methods
    function showPage(ctx) {
        var wiz = ctx.wizard;
        if (wiz.page === 0)
            wiz.b_prev.hide();
        else
            wiz.b_prev.show();
        if (wiz.page == wiz.pageCount - 1) {
            wiz.b_done.show();
            wiz.b_next.hide();
        } else {
            wiz.b_done.hide();
            wiz.b_next.show();
        }

        $(wiz.pages.hide().get(wiz.page)).show();
    }

    function move(d) {
        var wiz = this.wizard;
        var self = this;
        var lock = new Lock();

        $(this).trigger('wiz_hide:' + wiz.page, [lock]);
        this.loading = true;
        lock.wait(function(){
            if ((wiz.page < wiz.pageCount - 1 && d == 1) || (wiz.page > 0 && d == -1)) {
                wiz.page += d;
            }
            showPage(self);
            $(self).trigger('wiz_show:' + wiz.page);
        }).release(function(){
            self.loading = false;
        });
    }

    function wizardProxy(method, ctx) {
        return function (evt) {
            evt.preventDefault();
            if(!ctx.wizard.loading)
                method.apply(ctx, arguments);
        };
    }

    function done() {
        var lock = new Lock();
        var self = this;
        $(this).trigger('wiz_hide:' + this.wizard.page, [lock]);
        this.loading = true;
        lock.wait(function(){
            self.wizard.pages.hide();
            $(self).trigger('wiz_done');
        }).release(function(){
            self.loading = false;
        });
    }

    function noop(){}

    function Lock() {
        var cancelled = false;
        this.cancel = function () {
            cancelled = true;
        };

        var lockCount = 0;
        var lockedCb = noop;
        var releaseCb = noop;

        this.lock = function () {
            var unlocked = false;
            lockCount++;
            return function (cancel) {
                if (!unlocked) {
                    if(cancel) cancelled = true;
                    unlocked = true;
                    unlock();
                }
            };
        };

        this.wait = function (cb) {
            if (lockCount > 0)
                lockedCb = cb;
            else
                cb();
            return this;
        };

        this.release = function(cb){
            releaseCb = cb;
        };

        function unlock() {
            lockCount--;
            if (lockCount === 0 && lockedCb != null){
                if(cancelled)
                    releaseCb();
                else
                    lockedCb();
            }
        }
    }

    // Exposed methods
    var methods = {
        init: function () {
            var el = $(this);

            if (typeof (this.wizard) === 'undefined') {
                this.wizard = {};
                this.wizard.b_prev = el.find('[data-role="prev"]').click(wizardProxy(methods.prev, this));
                this.wizard.b_done = el.find('[data-role="done"]').click(wizardProxy(done, this));
                this.wizard.b_next = el.find('[data-role="next"]').click(wizardProxy(methods.next, this));
                this.wizard.b_cancel = el.find('[data-role="cancel"]');
            }

            this.wizard.pages = el.find('[data-role="page"]');

            this.wizard.pageCount = this.wizard.pages.length;
            this.wizard.page = 0;
            this.wizard.loading = false;

            showPage(this, true);
            $(this).trigger('wiz_show:0');
        },

        next: function () {
            move.call(this, 1);
        },

        prev: function () {
            move.call(this, -1);
        },

        loading: function(state){
            if(typeof state === 'boolean'){
                this.wizard.loading = state;
            } else {
                return this.wizard.loading;
            }
        }
    };

    $.extend($.fn, {
        wizard: function () {
            var callStack = [];
            if (arguments.length === 0) callStack.push('init');
            else if (typeof arguments[0] === 'string') {
                callStack.push(arguments[0]);
                if (arguments[0] !== 'init' && typeof this.wizard == 'undefined')
                    callStack.push('init');
            }

            return $(this).each(function () {
                while (callStack.length > 0) {
                    methods[callStack.pop()].call(this, Array.prototype.slice.call(arguments, 1));
                }
            });
        }
    });

})();
