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
        /* TODO Adding scroll to cureent accordion everytime clicking on a toggler
        scrollOnClick: true,
        */
        setAriaSupport: true,
        scrollOffset: {
            x: 0,
            y: 0
        },
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

    TrackInstances: true,

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
     * method urlInteraction
     * @desc check the url and set interactions like open and scroll to element.
     * @param _uri
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

                /* TODO Adding scroll to cureent accordion everytime clicking on a toggler
                if($this.options.scrollOnClick)
                    $this.scrollToElement(_viewPortItem);
                */
            });
        }, this);
    },

    /**
     *
     * @param item
     * @param el
     */

    displayAndScroll: function(item, el) {
        this.display(item);
        var setScroller = this.scrollToElement(el);
    },

    /**
     * Main method to execute the scroll effect
     * @param el
     * @returns {*}
     */

    scrollToElement: function(el) {
        var fxx = new Fx.Scroll(window, {
            offset: {
                x: this.options.scrollOffset.x,
                y: this.options.scrollOffset.y
            }
        });

        return fxx.start(0, el.getPosition().y);
    },

    /**
     * check if every element has an id, if not set one by checkin the instances
     */

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

    /**
     * adding the fragement to the uri
     * @param _viewPortItem
     */

    addFragment: function(_viewPortItem) {
        this.url.obj.set('fragment', '/'+_viewPortItem.get('id')).go();
    },

    /**
     * Adds the keyboard function
     */

    addKeyFunction: function() {
        var _togglers = this.togglers,
            options = this.options,
            _elements = this.elements;
        _togglers.each(function(el) {
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
            });
        });

        _elements.each(function(el) {
            el.setProperty('role', 'tabpanel');
            el.getParent(this.options.ariaTabListElement).setProperty('role', 'tablist');
        }, this);
    }
});