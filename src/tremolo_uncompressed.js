/*
---
script: Class.Mutators.TrackInstances.js
description: Allows a class to track its instances by having instances array as a class property
license: MIT-style license
authors:
- Elad Ossadon ( http://devign.me | http://twitter.com/elado )
requires:
- core:1.2.4
provides: [Class.Mutators.TrackInstances]
...
*/
Class.Mutators.TrackInstances=function (allow) {
    if (!allow) return;
    // save current initialize method
    var oldInit=this.prototype.initialize;
    var klass=this;
    // overwrite initialize method
    klass.prototype.initialize=function () {
        (klass.instances=klass.instances || []).push(this);
        oldInit.apply(this,arguments);
    };
};



var Tremolo = new Class({
    Extends: Fx.Accordion,
    options: {
        anchorItem: '.accordion-wrap',
        stopAnchorScroll: true,
        doctype: 'html5'
    },
    initialize: function() {
        this.url = this.urlHelper();
        
        if(this.url.hasFragment) {
            arguments[2].display = -1;
        }

        this.parent.apply(this, arguments);
        this.addKeyFunction();
        this.checkId();
        this.urlInteraction();
    },
    TrackInstances:true,
    /* urlHelper
     * @return object
     */
    urlHelper: function(_uri) {
        _uri = _uri || location.href;
        var _url = new URI(_uri),
            _frag = _url.get('fragment'),
            _hasFrag = (_frag != '') ? true : false;
            
        return {
            obj: _url,
            getFragment: _frag,
            hasFragment: _hasFrag
        }
    }.protect(),
    urlInteraction: function(_uri) {                
        
        var _togglers = this.togglers,
            _elements = this.elements,
            _fired = false;
        
        _togglers.each(function(el, i) {
            
            var _viewPortItem = el.getParent(this.options.anchorItem) || false,
                $this = this,
                c = this.url.getFragment.split('/');

            if(_viewPortItem.get('id') == c[1]) {
                this.displayAndScroll(i, _viewPortItem);
            }
            el.addEvent('click', function(event) {
                $this.url.obj.set('fragment', '/'+_viewPortItem.get('id')).go();
                var setScroller = $this.scrollToElement(_viewPortItem);
            });
        }, this);
    },
    displayAndScroll: function(item, el) {
        this.display(item);
        var setScroller = this.scrollToElement(el);
    },
    scrollToElement: function(el) {
        return new Fx.Scroll(window).toElement(el, 'y');
    },
    checkId: function() {
        var _togglers = this.togglers,
            _instanceCount = Tremolo.instances.length;
        _togglers.each(function(el, i) {
            var getParent = el.getParent(),
                _step = 'step'+_instanceCount+'-'+i;
            if(!getParent.hasAttribute('id')) {
                getParent.set('id', _step);
            }
        });
    },
    addKeyFunction: function() {
        var _togglers = this.togglers;
        _togglers.each(function(el) {

            el.addEvents({
            'keypress': function(event) {
                alert(el);
            },
            'focus': function() {
              this.addClass('hover');
            },
            'blur': function() {
              this.removeClass('hover');
            },
            'mouseenter': function() {
              this.addClass('hover');
            },
            'mouseleave': function() {
              this.removeClass('hover');
            }
            });
        });
    }
});