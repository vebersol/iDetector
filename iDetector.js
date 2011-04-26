/**
 * @author vebersol
 * @author aavila
 * 2010.07.01
 */

/**
  *
  *
  * Allowed Options:
  *
  * verticalStyles: an Object that contain each allowed device name and an Array with all css required for this device on vertical position.
  * horizontalStyles: an Object that contain each allowed device name and an Array with all css required for this device on vertical position.
  * standardStyles: an Array with all css required for not allowed devices, like common browsers.
  * cssPath: an string with correct path to css.
  * allowedDevices: an Array with allowed devices.
  * linksClassName: a class name for all css added dinamically.
  *
  * Example:
  * var options = {
  *		verticalStyles: {
  *		    ipad: ['ipad.css'],
  * 		iphone: ['iphone.css'],
  *			ipod: ['ipod.css']
  *		},
  *		horizontalStyles: {
  *			ipad: ['hor_ipad.css'],
  *			iphone: ['hor_iphone.css'],
  *			ipod: ['hor_ipod.css']
  *		},
  *		standardStyles: ['common.css'],
  *		cssPath: '../_css/',
  *		allowedDevices: ['ipad', 'ipod', 'iphone'],
  *     linksClassName: 'iDetector'
  *	}
  *
  * var detector = new iDetector(options);
  */

function iDetector(options){
	// on defining allowed devices, ipod MUST come before iphone.
	if (options) {
		this.options = options;
		this.linksClassName = options.linksClassName ? options.linksClassName : 'iDetector';
	}
}

iDetector.prototype = {

	addRotationEvent: function() {
		var _this = this;
		window.onorientationchange = function(){
			_this.defineStyles();
		};

	},

	addStyles: function(filenames) {
		this.removeLinkTags();
		var path = typeof(this.options.cssPath) != "undefined" ? this.options.cssPath : '';

		if (filenames.length > 0) {
		    for (var i = 0; i < filenames.length; i++) {
			    var html = document.createElement('link');
			    html.media = 'screen';
			    html.rel = 'stylesheet';
			    html.type = 'text/css';
			    html.href = path + filenames[i];
			    html.className = this.linksClassName;
			    html.id = filenames[i];

			    var head = document.getElementsByTagName('head')[0];
			    head.appendChild(html);
		    }
		}
	},

	allowedDevices: function() {
		if (!this.options.allowedDevices)
			return ['ipad', 'ipod','iphone'];
		else
			return this.options.allowedDevices;
	},

	defineStyles: function() {
		if (this.options) {
			var styles;
			var orientation = this.getOrientation();
			var deviceName = this.getDeviceName();

			if (deviceName && orientation == 0) {
				styles = typeof(this.options.verticalStyles[deviceName]) != "undefined" ? this.options.verticalStyles[deviceName] : this.options.standardStyles;
			}
			else if (deviceName && orientation != 0) {
				styles = typeof(this.options.horizontalStyles[deviceName]) != "undefined" ? this.options.horizontalStyles[deviceName] : this.options.standardStyles;
			}
			else {
				styles = this.options.standardStyles;
			}

			this.addStyles(styles);
		}
		else
			return false;
	},

	detectAgent: function() {
		var devices = this.allowedDevices();
		var agent = this.getAgent();
		for(var i = 0; i < devices.length; i++) {
	        if (agent.search(devices[i]) > 0) {
				return true;
	        }
	    }
		return false;
	},

	getAgent: function() {
		return navigator.userAgent.toLowerCase();
	},

	getDeviceName: function() {
		var devices = this.allowedDevices();
		var agent = this.getAgent();
		for(var i = 0; i < devices.length; i++) {
	        if (agent.search(devices[i]) > 0) {
				return devices[i];
	        }
	    }
		return false;
	},

	getOrientation: function() {
		if (this.getDeviceName() != false) {
			if (typeof(window.orientation) != "undefined")
				return window.orientation;
		}

		return false;
	},

	getOrientationType: function() {
	    var orientation = this.getOrientation();
	    var type = '';
        switch (orientation) {
            case 0:
            type = 'portrait';
            break;
            case 90:
            type = 'landscape';
            break;
            case 180:
            type = 'portrait';
            break;
            case -90:
            type = 'landscape';
            break;
        }

        return type;
	},

	getSizes: function() {
        var device = this.getDeviceName();
        var devicesSizes = this.defaultSizes();
        var orientationType = this.getOrientationType();

        if (devicesSizes[device]['browser'][orientationType])
            return devicesSizes[device]['browser'][orientationType];
        else
            return false;
	},

	defaultSizes: function() {
        var sizes = {'ipad':
                        {'browser':
                            {'portrait': {'width': 768, 'height': 946},
                            'landscape': {'width': 1024, 'height': 690}}
                        },
                    'iphone':
                        {'browser':
                            {'portrait': {'width': 320, 'height': 356},
                            'landscape': {'width': 480, 'height': 208}}
                        },
                    };
        return sizes;
	},

	removeLinkTags: function() {
		var tags = document.getElementsByTagName('link');
		for (var i = 0; i < tags.length; i++) {
			if (tags[i].className == this.linksClassName) {
				tags[i].parentNode.removeChild(tags[i]);
				i--;
			}
		}
	}

}

