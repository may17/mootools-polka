var Tremolo = new Class({
    Extends: Fx.Accordion,
    options: {
        anchorItem: '.accordion-wrap',
        stopAnchorScroll: true
    },
    initialize: function() {
        this.url = this.urlHelper();
        
        if(this.url.hasFragment) {
            arguments[2].display = -1;
        }
        
        this.parent.apply(this, arguments);
        this.urlInteraction();
    },
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
    }
});