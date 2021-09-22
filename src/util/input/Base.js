/** Vanilla JS geographic inputs
 * color, size, width, font, symboles, dash, arrow, pattern
 */
import ol_ext_inherits from '../ext'
import ol_Object from 'ol/Object'
import ol_ext_element from '../element';

/** @namespace  ol.ext.input
 */
/*global ol*/
if (window.ol) {
  ol.ext.input = {};
}

/** Abstract base class; normally only used for creating subclasses and not instantiated in apps.    
 * @constructor
 * @extends {ol_Object}
 * @param {*} options
 *  @param {Element} [options.input] input element, if non create one
 *  @param {string} [options.type] input type, if no input
 *  @param {number} [options.min] input min, if no input
 *  @param {number} [options.max] input max, if no input
 *  @param {number} [options.step] input step, if no input
 *  @param {string|number} [options.val] input value
 *  @param {boolean} [options.checked] check input
 *  @param {boolean} [options.hidden] the input is display:none
 *  @param {boolean} [options.disabled] disable input
 *  @param {Element} [options.parent] parent element, if no input
 */
var ol_ext_input_Base = function(options) {
  options = options || {};
  
  ol_Object.call(this);
  
  var input = this.input = options.input || ol_ext_element.create('INPUT', { 
    type: options.type,
    min: options.min,
    max: options.max,
    step: options.step,
    parent: options.parent
  });
  if (options.disabled) input.disabled = true;
  if (options.checked !== undefined) input.checked = !!options.checked;
  if (options.val !== undefined) input.value = options.val;
  if (options.hidden) input.style.display = 'none';
};
ol_ext_inherits(ol_ext_input_Base, ol_Object);

/** Listen to drag event
 * @param {Element} elt 
 * @param {function} cback when draggin on the element
 * @private
 */
ol_ext_input_Base.prototype._listenDrag = function(elt, cback) {
  var handle = function(e) {
    this.moving = true;
    var listen = function(e) {
      if (e.type==='pointerup') {
        document.removeEventListener('pointermove', listen);
        document.removeEventListener('pointerup', listen);
        document.removeEventListener('pointercancel', listen);
        setTimeout(function() {
          this.moving = false;
        }.bind(this));
      }
      if (e.target === elt) cback(e);
      e.stopPropagation();
      e.preventDefault();
    }.bind(this);
    document.addEventListener('pointermove', listen, false);
    document.addEventListener('pointerup', listen, false);
    document.addEventListener('pointercancel', listen, false);
    e.stopPropagation();
    e.preventDefault();
  }.bind(this)
  elt.addEventListener('mousedown', handle, false);
  elt.addEventListener('touchstart', handle, false);
};

/** Set the current value
 */
 ol_ext_input_Base.prototype.setValue = function(v) {
  if (v !== undefined) this.input.value = v;
  this.input.dispatchEvent(new Event('change'));
};

/** Get the current getValue
 * @returns {string}
 */
ol_ext_input_Base.prototype.getValue = function() {
  return this.input.value;
};

/** Get the input element
 * @returns {Element}
 */
ol_ext_input_Base.prototype.getInputElement = function() {
  return this.input;
};

export default ol_ext_input_Base
