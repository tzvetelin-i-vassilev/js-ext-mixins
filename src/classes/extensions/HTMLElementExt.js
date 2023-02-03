import Extension from "../Extension.js"

/**
 * HTMLElement extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class HTMLElementExt extends Extension {
	static properties = {
		computedStyle: {get: function() { return window.getComputedStyle(this); }, configurable: true}
	}

	/**
	 * Calculate top left position of the underlyimg dom element in the client coordinate system.
	 *
	 * @param {boolean} [relative=false] Skip scroller offset
	 * @returns {DOMPoint} Offset position (origin position)
	 */
	getClientOffset(relative = false) {
		let offsetParent = this;
		let offsetLeft = 0;
		let offsetTop  = 0;

		do {
			offsetLeft += offsetParent.offsetLeft;
			offsetTop  += offsetParent.offsetTop;

			offsetParent = offsetParent.offsetParent;
		}
		while (offsetParent);

		let scrollParent = this;
		let scrollLeft = 0;
		let scrollTop  = 0;

		if (!relative) {
			do {
				let position = scrollParent.computedStyle.position;

				if (position == "absolute" || position == "fixed") {
					scrollLeft = 0;
					scrollTop  = 0;

					break;
				}

				scrollLeft += scrollParent.scrollLeft;
				scrollTop  += scrollParent.scrollTop;
				scrollParent = scrollParent.parentNode;

				if (scrollParent && scrollParent.host)
					scrollParent = scrollParent.host;
			}
			while (scrollParent != document);
		}

		return new DOMPoint(offsetLeft - scrollLeft, offsetTop - scrollTop);
	}

	/**
	 * Calculate offset rect of the underlyimg element in the coordinate system of it's offset parent.
	 *
	 * @returns {DOMRect} Offset rect with prop 'outerSize', where it includes margins
	 */
	toRect() {
		let display = this.style.display;
		let visibility = this.style.visibility;

		if (display == "none") {
			this.style.visibility = "hidden";
			this.style.display = "";
		}

		let computedStyle = window.getComputedStyle(this);
		let margin = {
			left: parseFloat(computedStyle.marginLeft),
			top: parseFloat(computedStyle.marginTop),
			right: parseFloat(computedStyle.marginRight),
			bottom: parseFloat(computedStyle.marginBottom)
		};

		let outerWidth = this.offsetWidth + margin.left + margin.right;
		let outerHeight = this.offsetHeight + margin.top + margin.bottom;

		let result = new DOMRect(this.offsetLeft, this.offsetTop, this.offsetWidth, this.offsetHeight);
		result.outerSize = new DOMSize(outerWidth, outerHeight);

		if (display == "none") {
			this.style.visibility = visibility;
			this.style.display = "none";
		}

		return result;
	}
}

export default HTMLElementExt
