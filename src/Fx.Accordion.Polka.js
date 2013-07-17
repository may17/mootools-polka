Fx.Accordion.Polka = new Class({
    Extends: Fx.Accordion,

    /**
     * Adding new options
     */

    options: {
        // needed to clerly identify the wrapper of each toggler and accordion content element
        anchorItem: '.accordion-wrap',
        // jumps with to the toggler start
        jumpToOnClick: true,
        // Set basic aria support to the elements
        setAriaSupport: true,
        // define the aria Tablist wrapper, mostly the same like anchorItem
        ariaTabListElement: '.accordion-wrap',
        // define the name off the auto generated anchors
        autoItemName: 'accordion-item',
        // set a offset for the autoscroll
        scrollOffset: {
            x: 0,
            y: 0
        },
        //name of the css classes
        cssClasses: {
            hover: 'hover',
            active: 'active'
        },
        pseudoFragment: '/'
        /*
        onFragmentAdded: function(instance) { //your Code }
         */
    },

    /**
     * Initializer Method on construct
     */

    initialize: function() {
        this.url = this.urlHelper();
        
        if(this.url.hasFragment) {
            arguments[2].display = -1;
        }

        this.parent.apply(this, arguments);

        // check if the elements got an id and set them if not
        this.checkId();

        this.urlInteraction();

        if(this.options.display >= 0) {
            this.doNotJumpToAnchor(this.togglers[this.options.display].getParent(this.options.anchorItem));
        }

        if(this.options.setAriaSupport) {
            this.addKeyFunction();


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
        }

    },

    doNotJumpToAnchor: function(frag) {
        var scrollBuffer = window.getScroll();


        this.addEvent('complete:once', function() {
            this.addFragment(frag);
        });
    },

    /**
     * Set instance tracking
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
            self = this,
            _fired = false;
        
        _togglers.each(function(el, i) {
            
            var _viewPortItem = el.getParent(this.options.anchorItem) || false,
                _urlFragment = this.url.getFragment.substr(1);

            if(_viewPortItem.get('id') == _urlFragment) {
                window.scrollTo(0, 0);
                this.displayAndScroll(i, _viewPortItem);
            }

            el.addEvent('click', function(event) {
                var tt = el.getParent(self.options.anchorItem) || false;


                if(!self.options.jumpToOnClick) {
                    self.doNotJumpToAnchor(_viewPortItem);
                } else {
                    self.addEvent('complete:once', function() {
                        self.scrollToElement(tt, true);
                    });
                }
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
        this.scrollToElement(el);
    },

    /**
     * Main method to execute the scroll effect
     * @param el
     * @returns {*}
     */

    scrollToElement: function(el, addFrag) {
        addFrag = addFrag || false;

        var fxx = new Fx.Scroll(window, {
            offset: this.options.scrollOffset,
            onComplete: function() {
                if(addFrag) {
                    this.addFragment(el);
                }
            }.bind(this)
        });

        return fxx.start(0, el.getPosition().y);
    },

    /**
     * check if every element has an id, if not set one by checkin the instances
     */

    checkId: function() {
        var _togglers = this.togglers,
            _self = this,
            _instanceCount = Fx.Accordion.Polka.instances.length;
        _togglers.each(function(el, i) {
            var getParent = el.getParent(),
                _step = _self.options.autoItemName+_instanceCount+'-'+i;
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
        this.url.obj.set('fragment', this.options.pseudoFragment+_viewPortItem.get('id')).go();
        this.fireEvent('fragmentAdded', this);
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

Elements.implement({
    makePolka: function(accordions, options) {
        options = options || {};
        new Fx.Accordion.Polka(this, accordions, options);
    }
});