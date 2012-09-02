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
    /**
     * Adding new options
     */
    options: {
        anchorItem: '.accordion-wrap',
        stopAnchorScroll: true,
        setAriaSupport: true,
        ariaTabListElement: '.accordion-wrap',
        cssClasses: {
            hover: 'hover',
            active: 'active'
        }
    },
    /**
     * Constructor
     */
    initialize: function() {
        this.url = this.urlHelper();
        
        if(this.url.hasFragment) {
            arguments[2].display = -1;
        }

        this.parent.apply(this, arguments);
        if(this.options.setAriaSupport) {
            this.addKeyFunction();
        }
        this.checkId();
        this.urlInteraction();
        
        if(this.options.display >= 0) {
            this.addFragment(this.togglers[this.options.display].getParent(this.options.anchorItem));
            arguments[2].display = -1;
        }

        this.addEvents({
            'active': function(tog, el) {
                el.setProperty('aria-hidden', 'false');
                tog.addClass('active');
                tog.setProperty('aria-expanded', 'true');
            },
            'background': function(tog, el) {
                el.setProperty('aria-hidden', 'true');
                tog.removeClass('active');
                tog.setProperty('aria-expanded', 'false');
            }
        });
    },
    /**
     * Init the Track Instance Mutator
     */
    TrackInstances:true,
    /**
     * urlHelper
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
    /**
     * check the url and set interactions like open and scroll to element.
     */
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
                $this.addFragment(_viewPortItem);
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
    addFragment: function(_viewPortItem) {
        this.url.obj.set('fragment', '/'+_viewPortItem.get('id')).go();
    },
    addKeyFunction: function() {
        var _togglers = this.togglers,
<<<<<<< HEAD
            _elements = this.elements,
            self = this;
        _togglers.each(function(el, i) {
        console.log(i);
=======
            options = this.options,
            _elements = this.elements;
        _togglers.each(function(el) {
>>>>>>> Adding on background and on active aria support and active state for toggler
            el.setProperty('role', 'tab');
            el.setProperty('tabindex', 0);
            el.addEvents({
                'keypress': function(event) {
                    if (event.code == 13) {
                        this.fireEvent('click');
                    }
                },
                'focus': function() {
                    this.addClass(options.cssClasses.hover);
                },
                'blur': function() {
                    this.removeClass(options.cssClasses.hover);
                },
                'mouseenter': function() {
                    this.addClass(options.cssClasses.hover);
                },
                'mouseleave': function() {
                    this.removeClass(options.cssClasses.hover);
                }
<<<<<<< HEAD
                
            },/*
            'keydown': function(event) {
                if(event.code == 40) {
                    console.log(el);
                    //this.hide();
                    if(this.getNext()) {
                        console.log(i);
                        var t = i;
                        self.display(t++);
                    }
                    
                }
            },*/
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
=======
>>>>>>> Adding on background and on active aria support and active state for toggler
            });
        });
        _elements.each(function(el) {
            el.setProperty('role', 'tabpanel');
            el.getParent(this.options.ariaTabListElement).setProperty('role', 'tablist');
        }, this);
    }
});