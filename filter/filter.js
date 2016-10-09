/*	Copyright (c) 2016 Jean-Marc VIGLINO, 
	released under the CeCILL-B license (French BSD license)
	(http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
ol.filter = {};
/**
 * @classdesc 
 *   Abstract base class; normally only used for creating subclasses and not instantiated in apps. 
 *   Used to create filters
 *
 * @constructor
 * @extends {ol.Object}
 * @param {Object=} Control options. The style {ol.style.Style} option is usesd to draw the text.
 */
ol.filter.Base = function(options) 
{	ol.Object.call(this);
	if (options && options.active===false) this.set('active', false);
	else this.set('active', true);
}
ol.inherits(ol.filter.Base, ol.Object);

/** Activate / deactivate filter
*	@param {bool}
*/
ol.filter.Base.prototype.setActive = function (b)
{	this.set('active', b===true);
}

/** Get filter active
*	@return {bool}
*/
ol.filter.Base.prototype.getActive = function (b)
{	return this.set('active');
}

/** Internal function  
* @private
*/
ol.filter.Base.prototype.precompose_ = function(e)
{	if (this.get('active')) this.precompose(e);
}
/** Internal function  
* @private
*/
ol.filter.Base.prototype.postcompose_ = function(e)
{	if (this.get('active')) this.postcompose(e);
}
/** Force filter redraw / Internal function  
*	NB: this is the object to redraw
* @private
*/
ol.filter.Base.prototype.redraw_ = function(e)
{	if (this.renderSync) this.renderSync();
	else this.changed(); 
}

/** Add a filter to an ol object
*	@private
*/
ol.filter.Base.prototype.addFilter_ = function(filter)
{	if (!this.filters_) this.filters_ = [];
	this.filters_.push(filter);
	if (filter.precompose) this.on('precompose', filter.precompose_, filter);
	if (filter.postcompose) this.on('postcompose', filter.postcompose_, filter);
	filter.on('propertychange', filter.redraw_, this);
	filter.redraw_.call (this);
}

/** Remove a filter to an ol object
*	@private
*/
ol.filter.Base.prototype.removeFilter_ = function(filter)
{	if (!this.filters_) this.filters_ = [];
	for (var i=this.filters_.length-1; i>=0; i--)
	{	if (this.filters_[i]===filter) this.filters_.splice(i,1);
	}
	if (filter.precompose) this.un('precompose', filter.precompose_, filter);
	if (filter.postcompose) this.un('postcompose', filter.postcompose_, filter);
	filter.un('propertychange', filter.redraw_, this);
	filter.redraw_.call (this);
}

/** Add a filter to an ol.Map
*	@param {ol.filter}
*/
ol.Map.prototype.addFilter = function (filter)
{	ol.filter.Base.prototype.addFilter_.call (this, filter);
}
/** Remove a filter to an ol.Map
*	@param {ol.filter}
*/
ol.Map.prototype.removeFilter = function (filter)
{	ol.filter.Base.prototype.removeFilter_.call (this, filter);
}
/** Get filters associated with an ol.Map
*	@return {Array<ol.filter>}
*/
ol.Map.prototype.getFilters = function ()
{	return this.filters_;
}

/** Add a filter to an ol.Layer
*	@param {ol.filter}
*/
ol.layer.Base.prototype.addFilter = function (filter)
{	ol.filter.Base.prototype.addFilter_.call (this, filter);
}
/** Remove a filter to an ol.Layer
*	@param {ol.filter}
*/
ol.layer.Base.prototype.removeFilter = function (filter)
{	ol.filter.Base.prototype.removeFilter_.call (this, filter);
}

/** Get filters associated with an ol.Map
*	@return {Array<ol.filter>}
*/
ol.layer.Base.prototype.getFilters = function ()
{	return this.filters_;
}

