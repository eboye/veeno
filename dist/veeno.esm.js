import noUiSlider from 'nouislider';

var events = ['start', 'slide', 'update', 'change', 'set', 'end'];

var veeno = {
  name: 'veeno',
  props: {
    inputClass: {
      type: String,
      default: 'custom-slider-input'
    },
    inputName: {
      type: String,
      default: 'custom-slider-value'
    },
    options: {
      type: Object,
      default: function () { return ({
        start: [20, 80],
        connect: true,
        range: {
          'min': 0,
          'max': 100
        }
      }); }
    },
    vertical: {
      type: Boolean,
      default: false
    },
    handles: {
      type: [Number, Array],
      default: null
    },
    connect: {
      type: [Boolean, Array],
      default: false    // validate values are boolean
    },
    tooltips: {
      type: [Boolean, Array],
      default: false    // validate values are boolean
    },
    step: {
      type: Number,
      default: 0
    },
    range: {
      type: Object,
      required: true,
      validator: function (value) { return (!Array.isArray(value) && typeof value === 'object'); }
    },
    pipsy: {
      type: [Boolean, Object],
      default: function () { return false; },
      validator: function (value) { return (typeof value === 'boolean' || !Array.isArray(value) && typeof value === 'object'); }
    },
    rtl: {
      type: Boolean,
      default: false
    },
    // test below (set) prop for both types i.e. Number, Array
    set: {
      type: [Number, Array],
      default: null,
      validator: function (value) { return (typeof value === 'number' || Array.isArray(value)); }
    },
    behaviour: {
      type: String,
      default: 'tap',
      validator: function (value) { return ['drag', 'tap', 'fixed', 'snap', 'none', 'unconstrained-tap'].indexOf( value !== -1); }
    },
    getset: {
      type: Function,
      default: function () { return function () { return ''; }; }
    }
  },
  created: function created () {
    this.optionz = Object.assign({},
      this.options, this.$props,
      // this.vertical ? this.options.orientation = 'vertical': '',
      this.vertical && (this.options.orientation = 'vertical'),
      this.handles && (this.options.start = this.handles),
      this.rtl && (this.options.direction = 'rtl'),
      this.pipsy && !Object.keys(this.pipsy).length ?
        this.options.pips = {mode: 'range',density: 5} : this.options.pips = this.pipsy
    );
  },
  mounted: function mounted () {
    var this$1 = this;

    var slider = this.$el;
    this.options.orientation === 'vertical' && (slider.style.height = '100%');
    noUiSlider.create(slider, this.optionz);

    events.forEach(function (event) {
      slider.noUiSlider.on(event, function (values, handle, unencoded, tap, positions) {
        this$1.$emit(event, {values: values, handle: handle, unencoded: unencoded, tap: tap, positions: positions});
        event === 'update' && (this$1.$emit('input', values[handle]));
      });
    });
    this.getset(slider);
  },
  render: function render (createElement) {
    var child = createElement('input',
        {
          attrs: {
            'type': 'hidden',
            name:this.name,
          },
          class:this.inputClass
        }
      );
    var span = createElement('span', spanOptions,this.$slots.default);

    return createElement('div',
    divOptions,
    [
      child,
      span
    ])
  },
  data: function data () {
    return {
      optionz: Object,
      latestHandleValue: null
    }
  },
  watch: {
    set: function set (newValue) {
      // * reference: https://refreshless.com/nouislider/slider-read-write/
      this.$el.noUiSlider.set(newValue);
    }
  }
}

var divOptions = {
    style: {
      position: 'relative'
    },
    class: {
      'veeno': true
    },
    attrs: { name:'custom-slider' }
};

var spanOptions = {
  style: {
    position: 'absolute',
    top: '-2.5rem'
  },
  class: {
    'veeno-span': true
  }
};

// Import vue component

// install function executed by Vue.use()
function install(Vue) {
	if (install.installed) { return; }
	install.installed = true;
	Vue.component('veeno', veeno);
}

// Create module definition for Vue.use()
var plugin = {
	install: install,
};

// To auto-install when vue is found
var GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default veeno;
export { install };
