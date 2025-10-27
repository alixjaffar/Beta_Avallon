'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var styledJsx_cjs = require('../styled-jsx.cjs.js');
var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var defaultFont = {
  sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  mono: 'Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace',
  prism: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,"Liberation Mono", "Courier New", monospace'
};
var defaultBreakpoints = {
  xs: {
    min: '0',
    max: '650px'
  },
  sm: {
    min: '650px',
    max: '900px'
  },
  md: {
    min: '900px',
    max: '1280px'
  },
  lg: {
    min: '1280px',
    max: '1920px'
  },
  xl: {
    min: '1920px',
    max: '10000px'
  }
};
var defaultLayout = {
  gap: '16pt',
  gapNegative: '-16pt',
  gapHalf: '8pt',
  gapHalfNegative: '-8pt',
  gapQuarter: '4pt',
  gapQuarterNegative: '-4pt',
  pageMargin: '16pt',
  pageWidth: '750pt',
  pageWidthWithMargin: '782pt',
  breakpointMobile: defaultBreakpoints.xs.max,
  breakpointTablet: defaultBreakpoints.sm.max,
  radius: '6px',
  unit: '16px'
};

var palette$1 = {
  accents_1: '#fafafa',
  accents_2: '#eaeaea',
  accents_3: '#999',
  accents_4: '#888',
  accents_5: '#666',
  accents_6: '#444',
  accents_7: '#333',
  accents_8: '#111',
  background: '#fff',
  foreground: '#000',
  selection: '#79ffe1',
  secondary: '#666',
  code: '#f81ce5',
  border: '#eaeaea',
  error: '#e00',
  errorLight: '#ff1a1a',
  errorLighter: '#f7d4d6',
  errorDark: '#c50000',
  success: '#0070f3',
  successLight: '#3291ff',
  successLighter: '#d3e5ff',
  successDark: '#0761d1',
  warning: '#f5a623',
  warningLight: '#f7b955',
  warningLighter: '#ffefcf',
  warningDark: '#ab570a',
  cyan: '#50e3c2',
  cyanLighter: '#aaffec',
  cyanLight: '#79ffe1',
  cyanDark: '#29bc9b',
  violet: '#7928ca',
  violetLighter: '#e3d7fc',
  violetLight: '#8a63d2',
  violetDark: '#4c2889',
  purple: '#f81ce5',
  alert: '#ff0080',
  magenta: '#eb367f',
  link: '#0070f3'
};
var expressiveness$1 = {
  linkStyle: 'none',
  linkHoverStyle: 'none',
  dropdownBoxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.02)',
  scrollerStart: 'rgba(255, 255, 255, 1)',
  scrollerEnd: 'rgba(255, 255, 255, 0)',
  shadowSmall: '0 5px 10px rgba(0, 0, 0, 0.12)',
  shadowMedium: '0 8px 30px rgba(0, 0, 0, 0.12)',
  shadowLarge: '0 30px 60px rgba(0, 0, 0, 0.12)',
  portalOpacity: 0.25
};
var font$1 = defaultFont;
var breakpoints$1 = defaultBreakpoints;
var layout$1 = defaultLayout;
var themes$1 = {
  type: 'light',
  font: font$1,
  layout: layout$1,
  palette: palette$1,
  breakpoints: breakpoints$1,
  expressiveness: expressiveness$1
};
var lightTheme = themes$1;

var palette = {
  accents_1: '#111',
  accents_2: '#333',
  accents_3: '#444',
  accents_4: '#666',
  accents_5: '#888',
  accents_6: '#999',
  accents_7: '#eaeaea',
  accents_8: '#fafafa',
  background: '#000',
  foreground: '#fff',
  selection: '#f81ce5',
  secondary: '#888',
  code: '#79ffe1',
  border: '#333',
  error: '#e00',
  errorLighter: '#f7d4d6',
  errorLight: '#ff1a1a',
  errorDark: '#c50000',
  success: '#0070f3',
  successLighter: '#d3e5ff',
  successLight: '#3291ff',
  successDark: '#0761d1',
  warning: '#f5a623',
  warningLighter: '#ffefcf',
  warningLight: '#f7b955',
  warningDark: '#ab570a',
  cyan: '#50e3c2',
  cyanLighter: '#aaffec',
  cyanLight: '#79ffe1',
  cyanDark: '#29bc9b',
  violet: '#7928ca',
  violetLighter: '#e3d7fc',
  violetLight: '#8a63d2',
  violetDark: '#4c2889',
  purple: '#f81ce5',
  alert: '#ff0080',
  magenta: '#eb367f',
  link: '#3291ff'
};
var expressiveness = {
  linkStyle: 'none',
  linkHoverStyle: 'none',
  dropdownBoxShadow: '0 0 0 1px #333',
  scrollerStart: 'rgba(255, 255, 255, 1)',
  scrollerEnd: 'rgba(255, 255, 255, 0)',
  shadowSmall: '0 0 0 1px #333',
  shadowMedium: '0 0 0 1px #333',
  shadowLarge: '0 0 0 1px #333',
  portalOpacity: 0.75
};
var font = defaultFont;
var breakpoints = defaultBreakpoints;
var layout = defaultLayout;
var themes = {
  type: 'dark',
  font: font,
  layout: layout,
  palette: palette,
  breakpoints: breakpoints,
  expressiveness: expressiveness
};
var darkTheme = themes;

var isObject = function isObject(target) {
  return target && _typeof(target) === 'object';
};
var deepDuplicable = function deepDuplicable(source, target) {
  if (!isObject(target) || !isObject(source)) return source;
  var sourceKeys = Object.keys(source);
  var result = {};

  for (var _i = 0, _sourceKeys = sourceKeys; _i < _sourceKeys.length; _i++) {
    var key = _sourceKeys[_i];
    var sourceValue = source[key];
    var targetValue = target[key];

    if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
      result[key] = targetValue.concat(sourceValue);
    } else if (isObject(sourceValue) && isObject(targetValue)) {
      result[key] = deepDuplicable(sourceValue, _objectSpread2({}, targetValue));
    } else if (targetValue) {
      result[key] = targetValue;
    } else {
      result[key] = sourceValue;
    }
  }

  return result;
};

var getPresets = function getPresets() {
  return [lightTheme, darkTheme];
};

var getPresetStaticTheme = function getPresetStaticTheme() {
  return lightTheme;
};

var isAvailableThemeType = function isAvailableThemeType(type) {
  if (!type) return false;
  var presetThemes = getPresets();
  var hasType = presetThemes.find(function (theme) {
    return theme.type === type;
  });
  return !hasType;
};

var isPresetTheme = function isPresetTheme(themeOrType) {
  if (!themeOrType) return false;
  var isType = typeof themeOrType === 'string';
  var type = isType ? themeOrType : themeOrType.type;
  return !isAvailableThemeType(type);
};

var hasUserCustomTheme = function hasUserCustomTheme() {
  var themes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return !!themes.find(function (item) {
    return isAvailableThemeType(item.type);
  });
};

var create = function create(base, custom) {
  if (!isAvailableThemeType(custom.type)) {
    throw new Error('Duplicate or unavailable theme type');
  }

  return deepDuplicable(base, custom);
};

var createFromDark = function createFromDark(custom) {
  return create(darkTheme, custom);
};

var createFromLight = function createFromLight(custom) {
  return create(lightTheme, custom);
};

var Themes = {
  isPresetTheme: isPresetTheme,
  isAvailableThemeType: isAvailableThemeType,
  hasUserCustomTheme: hasUserCustomTheme,
  getPresets: getPresets,
  getPresetStaticTheme: getPresetStaticTheme,
  create: create,
  createFromDark: createFromDark,
  createFromLight: createFromLight
};
var Themes$1 = Themes;

var defaultTheme = Themes$1.getPresetStaticTheme();
var ThemeContext = /*#__PURE__*/React__default["default"].createContext(defaultTheme);
var useTheme$1 = function useTheme() {
  return React__default["default"].useContext(ThemeContext);
};

var useTheme = useTheme$1;

var defaultProps$6 = {
  width: 22,
  height: 22
};

var TreeFileIcon = function TreeFileIcon(_ref) {
  var color = _ref.color,
      width = _ref.width,
      height = _ref.height;
  var theme = useTheme();
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 24 24",
    width: width,
    height: height,
    stroke: "currentColor",
    strokeWidth: "1",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision",
    className: styledJsx_cjs.style.dynamic([["4043754792", [color || theme.palette.accents_8]]])
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z",
    className: styledJsx_cjs.style.dynamic([["4043754792", [color || theme.palette.accents_8]]])
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M13 2v7h7",
    className: styledJsx_cjs.style.dynamic([["4043754792", [color || theme.palette.accents_8]]])
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "4043754792",
    dynamic: [color || theme.palette.accents_8]
  }, "svg.__jsx-style-dynamic-selector{color:".concat(color || theme.palette.accents_8, ";}")));
};

TreeFileIcon.defaultProps = defaultProps$6;
TreeFileIcon.displayName = 'GeistTreeFileIcon';
var TreeFileIcon$1 = TreeFileIcon;

var defaultContext = {
  initialExpand: false,
  isImperative: false
};
var TreeContext = /*#__PURE__*/React__default["default"].createContext(defaultContext);
var useTreeContext = function useTreeContext() {
  return React__default["default"].useContext(TreeContext);
};

var TreeIndents = function TreeIndents(_ref) {
  var count = _ref.count;
  if (count === 0) return null;
  return (
    /*#__PURE__*/

    /* eslint-disable react/jsx-no-useless-fragment */
    React__default["default"].createElement(React__default["default"].Fragment, null, _toConsumableArray(new Array(count)).map(function (_, index) {
      return /*#__PURE__*/React__default["default"].createElement("span", {
        key: "indent-".concat(index),
        className: styledJsx_cjs.style.dynamic([["2622387629", [index + 1]]]) + " " + "indent"
      }, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
        id: "2622387629",
        dynamic: [index + 1]
      }, "span.indent.__jsx-style-dynamic-selector{left:calc(-1.875rem * ".concat(index + 1, " + 0.75rem);}")));
    }))
    /* eslint-enable */

  );
};

var TreeIndents$1 = TreeIndents;

var sortChildren = function sortChildren(children, folderComponentType) {
  return React__default["default"].Children.toArray(children).sort(function (a, b) {
    if (! /*#__PURE__*/React__default["default"].isValidElement(a) || ! /*#__PURE__*/React__default["default"].isValidElement(b)) return 0;
    if (a.type !== b.type) return a.type !== folderComponentType ? 1 : -1;
    return "".concat(a.props.name).charCodeAt(0) - "".concat(b.props.name).charCodeAt(0);
  });
};
var makeChildPath = function makeChildPath(name, parentPath) {
  if (!parentPath) return name;
  return "".concat(parentPath, "/").concat(name);
};
var stopPropagation = function stopPropagation(event) {
  event.stopPropagation();
  event.nativeEvent.stopImmediatePropagation();
};

var classObjectToString = function classObjectToString(className) {
  var keys = Object.keys(className);
  var len = keys.length;
  var str = '';

  for (var index = 0; index < len; index++) {
    var key = keys[index];
    var val = className[keys[index]];
    if (!val) continue;
    str = str ? "".concat(str, " ").concat(String(key)) : String(key);
  }

  return str;
};

var isObjectClassName = function isObjectClassName(value) {
  return _typeof(value) === 'object' && !Array.isArray(value);
};

var useClasses = function useClasses() {
  var len = arguments.length;
  var classes = '';
  if (len === 0) return classes;

  for (var index = 0; index < len; index++) {
    var val = index < 0 || arguments.length <= index ? undefined : arguments[index];
    if (!val) continue;

    if (isObjectClassName(val)) {
      classes += " ".concat(classObjectToString(val));
    } else {
      classes += " ".concat(String(val).trim());
    }
  }

  return classes.trim();
};

var useClasses$1 = useClasses;

var _excluded$2 = ["name", "parentPath", "level", "extra", "className"];
var defaultProps$5 = {
  level: 0,
  className: '',
  parentPath: ''
};

var TreeFile = function TreeFile(_ref) {
  var name = _ref.name,
      parentPath = _ref.parentPath,
      level = _ref.level,
      extra = _ref.extra,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$2);

  var theme = useTheme();

  var _useTreeContext = useTreeContext(),
      onFileClick = _useTreeContext.onFileClick;

  var currentPath = React.useMemo(function () {
    return makeChildPath(name, parentPath);
  }, []);

  var clickHandler = function clickHandler(event) {
    stopPropagation(event);
    onFileClick && onFileClick(currentPath);
  };

  return /*#__PURE__*/React__default["default"].createElement("div", _extends({
    onClick: clickHandler
  }, props, {
    className: styledJsx_cjs.style.dynamic([["4220802947", [level, theme.palette.accents_2, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + (props && props.className != null && props.className || useClasses$1('file', className) || "")
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["4220802947", [level, theme.palette.accents_2, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "names"
  }, /*#__PURE__*/React__default["default"].createElement(TreeIndents$1, {
    count: level
  }), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["4220802947", [level, theme.palette.accents_2, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "icon"
  }, /*#__PURE__*/React__default["default"].createElement(TreeFileIcon$1, null)), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["4220802947", [level, theme.palette.accents_2, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "name"
  }, name, extra && /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["4220802947", [level, theme.palette.accents_2, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "extra"
  }, extra))), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "4220802947",
    dynamic: [level, theme.palette.accents_2, theme.palette.accents_8, theme.palette.accents_5]
  }, ".file.__jsx-style-dynamic-selector{cursor:pointer;line-height:1;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;margin-left:calc(1.875rem * ".concat(level, ");}.names.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;height:1.75rem;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;position:relative;}.names.__jsx-style-dynamic-selector>.indent{position:absolute;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);width:1px;height:100%;background-color:").concat(theme.palette.accents_2, ";margin-left:-1px;}.icon.__jsx-style-dynamic-selector{width:1.5rem;height:100%;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;margin-right:0.5rem;}.name.__jsx-style-dynamic-selector{-webkit-transition:opacity 100ms ease 0ms;transition:opacity 100ms ease 0ms;color:").concat(theme.palette.accents_8, ";white-space:nowrap;font-size:0.875rem;}.extra.__jsx-style-dynamic-selector{font-size:0.75rem;-webkit-align-self:baseline;-ms-flex-item-align:baseline;align-self:baseline;padding-left:4px;color:").concat(theme.palette.accents_5, ";}.name.__jsx-style-dynamic-selector:hover{opacity:0.7;}")));
};

TreeFile.defaultProps = defaultProps$5;
TreeFile.displayName = 'GeistTreeFile';
var TreeFile$1 = TreeFile;

var setChildrenProps = function setChildrenProps(children, props) {
  var targetComponents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  if (React__default["default"].Children.count(children) === 0) return [];
  var allowAll = targetComponents.length === 0;

  var clone = function clone(child) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return /*#__PURE__*/React__default["default"].cloneElement(child, props);
  };

  return React__default["default"].Children.map(children, function (item) {
    if (! /*#__PURE__*/React__default["default"].isValidElement(item)) return item;
    if (allowAll) return clone(item, props);
    var isAllowed = targetComponents.find(function (child) {
      return child === item.type;
    });
    if (isAllowed) return clone(item, props);
    return item;
  });
};

var getRealShape = function getRealShape(el) {
  var defaultShape = {
    width: 0,
    height: 0
  };
  if (!el || typeof window === 'undefined') return defaultShape;
  var rect = el.getBoundingClientRect();

  var _window$getComputedSt = window.getComputedStyle(el),
      width = _window$getComputedSt.width,
      height = _window$getComputedSt.height;

  var getCSSStyleVal = function getCSSStyleVal(str, parentNum) {
    if (!str) return 0;
    var strVal = str.includes('px') ? +str.split('px')[0] : str.includes('%') ? +str.split('%')[0] * parentNum * 0.01 : str;
    return Number.isNaN(+strVal) ? 0 : +strVal;
  };

  return {
    width: getCSSStyleVal("".concat(width), rect.width),
    height: getCSSStyleVal("".concat(height), rect.height)
  };
};

var useRealShape = function useRealShape(ref) {
  var _useState = React.useState({
    width: 0,
    height: 0
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  var update = function update() {
    var _getRealShape = getRealShape(ref.current),
        width = _getRealShape.width,
        height = _getRealShape.height;

    setState({
      width: width,
      height: height
    });
  };

  React.useEffect(function () {
    return update();
  }, [ref.current]);
  return [state, update];
};

var useRealShape$1 = useRealShape;

var defaultProps$4 = {
  isExpanded: false,
  delay: 200
};

var Expand = function Expand(_ref) {
  var isExpanded = _ref.isExpanded,
      delay = _ref.delay,
      children = _ref.children;

  var _useState = React.useState(isExpanded ? 'auto' : '0'),
      _useState2 = _slicedToArray(_useState, 2),
      height = _useState2[0],
      setHeight = _useState2[1];

  var _useState3 = React.useState(isExpanded),
      _useState4 = _slicedToArray(_useState3, 2),
      selfExpanded = _useState4[0],
      setSelfExpanded = _useState4[1];

  var _useState5 = React.useState(isExpanded),
      _useState6 = _slicedToArray(_useState5, 2),
      visible = _useState6[0],
      setVisible = _useState6[1];

  var contentRef = React.useRef(null);
  var entryTimer = React.useRef();
  var leaveTimer = React.useRef();
  var resetTimer = React.useRef();

  var _useRealShape = useRealShape$1(contentRef),
      _useRealShape2 = _slicedToArray(_useRealShape, 2),
      state = _useRealShape2[0],
      updateShape = _useRealShape2[1];

  var classes = useClasses$1('container', {
    expanded: selfExpanded
  });
  React.useEffect(function () {
    return setHeight("".concat(state.height, "px"));
  }, [state.height]);
  React.useEffect(function () {
    // show element or reset height.
    // force an update once manually, even if the element does not change.
    // (the height of the element might be "auto")
    if (isExpanded) {
      setVisible(isExpanded);
    } else {
      updateShape();
      setHeight("".concat(state.height, "px"));
    } // show expand animation


    entryTimer.current = window.setTimeout(function () {
      setSelfExpanded(isExpanded);
      clearTimeout(entryTimer.current);
    }, 30); // Reset height after animation

    if (isExpanded) {
      resetTimer.current = window.setTimeout(function () {
        setHeight('auto');
        clearTimeout(resetTimer.current);
      }, delay);
    } else {
      leaveTimer.current = window.setTimeout(function () {
        setVisible(isExpanded);
        clearTimeout(leaveTimer.current);
      }, delay / 2);
    }

    return function () {
      clearTimeout(entryTimer.current);
      clearTimeout(leaveTimer.current);
      clearTimeout(resetTimer.current);
    };
  }, [isExpanded]);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["1918690829", [visible ? 'visible' : 'hidden', delay, height]]]) + " " + (classes || "")
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    ref: contentRef,
    className: styledJsx_cjs.style.dynamic([["1918690829", [visible ? 'visible' : 'hidden', delay, height]]]) + " " + "content"
  }, children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1918690829",
    dynamic: [visible ? 'visible' : 'hidden', delay, height]
  }, ".container.__jsx-style-dynamic-selector{padding:0;margin:0;height:0;overflow:hidden;visibility:".concat(visible ? 'visible' : 'hidden', ";-webkit-transition:height ").concat(delay, "ms ease;transition:height ").concat(delay, "ms ease;}.expanded.__jsx-style-dynamic-selector{height:").concat(height, ";visibility:visible;}")));
};

Expand.defaultProps = defaultProps$4;
Expand.displayName = 'GeistExpand';
var Expand$1 = Expand;

var defaultProps$3 = {
  width: 22,
  height: 22
};

var TreeFolderIcon = function TreeFolderIcon(_ref) {
  var color = _ref.color,
      width = _ref.width,
      height = _ref.height;
  var theme = useTheme();
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 24 24",
    width: width,
    height: height,
    stroke: "currentColor",
    strokeWidth: "1",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision",
    className: styledJsx_cjs.style.dynamic([["4043754792", [color || theme.palette.accents_8]]])
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M2.707 7.454V5.62C2.707 4.725 3.469 4 4.409 4h4.843c.451 0 .884.17 1.204.474l.49.467c.126.12.296.186.473.186h8.399c.94 0 1.55.695 1.55 1.59v.737m-18.661 0h-.354a.344.344 0 00-.353.35l.508 11.587c.015.34.31.609.668.609h17.283c.358 0 .652-.269.667-.61L22 7.805a.344.344 0 00-.353-.35h-.278m-18.662 0h18.662",
    className: styledJsx_cjs.style.dynamic([["4043754792", [color || theme.palette.accents_8]]])
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "4043754792",
    dynamic: [color || theme.palette.accents_8]
  }, "svg.__jsx-style-dynamic-selector{color:".concat(color || theme.palette.accents_8, ";}")));
};

TreeFolderIcon.defaultProps = defaultProps$3;
TreeFolderIcon.displayName = 'GeistTreeFolderIcon';
var TreeFolderIcon$1 = TreeFolderIcon;

var defaultProps$2 = {
  width: 12,
  height: 12,
  active: false
};

var TreeStatusIcon = function TreeStatusIcon(_ref) {
  var color = _ref.color,
      width = _ref.width,
      height = _ref.height,
      active = _ref.active;
  var theme = useTheme();
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 24 24",
    width: width,
    height: height,
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision",
    className: styledJsx_cjs.style.dynamic([["4043754792", [color || theme.palette.accents_8]]])
  }, /*#__PURE__*/React__default["default"].createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "2",
    ry: "2",
    className: styledJsx_cjs.style.dynamic([["4043754792", [color || theme.palette.accents_8]]])
  }), !active && /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M12 8v8",
    className: styledJsx_cjs.style.dynamic([["4043754792", [color || theme.palette.accents_8]]])
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M8 12h8",
    className: styledJsx_cjs.style.dynamic([["4043754792", [color || theme.palette.accents_8]]])
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "4043754792",
    dynamic: [color || theme.palette.accents_8]
  }, "svg.__jsx-style-dynamic-selector{color:".concat(color || theme.palette.accents_8, ";}")));
};

TreeStatusIcon.defaultProps = defaultProps$2;
TreeStatusIcon.displayName = 'GeistTreeStatusIcon';
var TreeStatusIcon$1 = TreeStatusIcon;

var _excluded$1 = ["name", "children", "parentPath", "level", "extra", "className"];
var defaultProps$1 = {
  level: 0,
  className: '',
  parentPath: ''
};

var TreeFolder = function TreeFolder(_ref) {
  var name = _ref.name,
      children = _ref.children,
      parentPath = _ref.parentPath,
      parentLevel = _ref.level,
      extra = _ref.extra,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$1);

  var theme = useTheme();

  var _useTreeContext = useTreeContext(),
      initialExpand = _useTreeContext.initialExpand,
      isImperative = _useTreeContext.isImperative;

  var _useState = React.useState(initialExpand),
      _useState2 = _slicedToArray(_useState, 2),
      expanded = _useState2[0],
      setExpanded = _useState2[1];

  React.useEffect(function () {
    return setExpanded(initialExpand);
  }, []);
  var currentPath = React.useMemo(function () {
    return makeChildPath(name, parentPath);
  }, []);

  var clickHandler = function clickHandler() {
    return setExpanded(!expanded);
  };

  var nextChildren = setChildrenProps(children, {
    parentPath: currentPath,
    level: parentLevel + 1
  }, [TreeFolder, TreeFile$1]);
  var sortedChildren = isImperative ? nextChildren : sortChildren(nextChildren, TreeFolder);
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({
    onClick: clickHandler
  }, props, {
    className: styledJsx_cjs.style.dynamic([["1983983326", [parentLevel, theme.palette.accents_2, theme.palette.background, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + (props && props.className != null && props.className || useClasses$1('folder', className) || "")
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["1983983326", [parentLevel, theme.palette.accents_2, theme.palette.background, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "names"
  }, /*#__PURE__*/React__default["default"].createElement(TreeIndents$1, {
    count: parentLevel
  }), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["1983983326", [parentLevel, theme.palette.accents_2, theme.palette.background, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "status"
  }, /*#__PURE__*/React__default["default"].createElement(TreeStatusIcon$1, {
    active: expanded
  })), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["1983983326", [parentLevel, theme.palette.accents_2, theme.palette.background, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "icon"
  }, /*#__PURE__*/React__default["default"].createElement(TreeFolderIcon$1, null)), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["1983983326", [parentLevel, theme.palette.accents_2, theme.palette.background, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "name"
  }, name, extra && /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["1983983326", [parentLevel, theme.palette.accents_2, theme.palette.background, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "extra"
  }, extra))), /*#__PURE__*/React__default["default"].createElement(Expand$1, {
    isExpanded: expanded
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    onClick: stopPropagation,
    className: styledJsx_cjs.style.dynamic([["1983983326", [parentLevel, theme.palette.accents_2, theme.palette.background, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "content"
  }, sortedChildren)), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1983983326",
    dynamic: [parentLevel, theme.palette.accents_2, theme.palette.background, theme.palette.accents_8, theme.palette.accents_5]
  }, ".folder.__jsx-style-dynamic-selector{cursor:pointer;line-height:1;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}.names.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;height:1.75rem;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;margin-left:calc(1.875rem * ".concat(parentLevel, ");position:relative;}.names.__jsx-style-dynamic-selector>.indent{position:absolute;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);width:1px;height:100%;background-color:").concat(theme.palette.accents_2, ";margin-left:-1px;}.status.__jsx-style-dynamic-selector{position:absolute;left:calc(-1.125rem);top:50%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);width:0.875rem;height:0.875rem;z-index:10;background-color:").concat(theme.palette.background, ";}.icon.__jsx-style-dynamic-selector{width:1.5rem;height:100%;margin-right:0.5rem;}.status.__jsx-style-dynamic-selector,.icon.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;}.name.__jsx-style-dynamic-selector{-webkit-transition:opacity 100ms ease 0ms;transition:opacity 100ms ease 0ms;color:").concat(theme.palette.accents_8, ";white-space:nowrap;font-size:0.875rem;}.extra.__jsx-style-dynamic-selector{font-size:0.75rem;-webkit-align-self:baseline;-ms-flex-item-align:baseline;align-self:baseline;padding-left:4px;color:").concat(theme.palette.accents_5, ";}.name.__jsx-style-dynamic-selector:hover{opacity:0.7;}.content.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;height:auto;}")));
};

TreeFolder.defaultProps = defaultProps$1;
TreeFolder.displayName = 'GeistTreeFolder';
var TreeFolder$1 = TreeFolder;

var tuple = function tuple() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args;
};
tuple('default', 'secondary', 'success', 'warning', 'error', 'abort', 'secondary-light', 'success-light', 'warning-light', 'error-light');
tuple('default', 'secondary', 'success', 'warning', 'error');
tuple('default', 'secondary', 'success', 'warning', 'error', 'dark', 'lite');
tuple('default', 'secondary', 'success', 'warning', 'error', 'dark', 'lite', 'alert', 'purple', 'violet', 'cyan');
tuple('default', 'silent', 'prevent');
tuple('hover', 'click');
tuple('top', 'topStart', 'topEnd', 'left', 'leftStart', 'leftEnd', 'bottom', 'bottomStart', 'bottomEnd', 'right', 'rightStart', 'rightEnd');
tuple('start', 'center', 'end', 'left', 'right');

var _excluded = ["children", "onClick", "initialExpand", "value", "className"];
var FileTreeValueType = tuple('directory', 'file');
var directoryType = FileTreeValueType[0];
var defaultProps = {
  initialExpand: false,
  className: ''
};

var makeChildren = function makeChildren() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  if (!value || !value.length) return null;
  return value.sort(function (a, b) {
    if (a.type !== b.type) return a.type !== directoryType ? 1 : -1;
    return "".concat(a.name).charCodeAt(0) - "".concat(b.name).charCodeAt(0);
  }).map(function (item, index) {
    if (item.type === directoryType) return /*#__PURE__*/React__default["default"].createElement(TreeFolder$1, {
      name: item.name,
      extra: item.extra,
      key: "folder-".concat(item.name, "-").concat(index)
    }, makeChildren(item.files));
    return /*#__PURE__*/React__default["default"].createElement(TreeFile$1, {
      name: item.name,
      extra: item.extra,
      key: "file-".concat(item.name, "-").concat(index)
    });
  });
};

var Tree = function Tree(_ref) {
  var children = _ref.children,
      onClick = _ref.onClick,
      initialExpand = _ref.initialExpand,
      value = _ref.value,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded);

  var isImperative = Boolean(value && value.length > 0);

  var onFileClick = function onFileClick(path) {
    onClick && onClick(path);
  };

  var initialValue = React.useMemo(function () {
    return {
      onFileClick: onFileClick,
      initialExpand: initialExpand,
      isImperative: isImperative
    };
  }, [initialExpand]);
  var customChildren = isImperative ? makeChildren(value) : sortChildren(children, TreeFolder$1);
  return /*#__PURE__*/React__default["default"].createElement(TreeContext.Provider, {
    value: initialValue
  }, /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: "jsx-2273069862" + " " + (props && props.className != null && props.className || useClasses$1('tree', className) || "")
  }), customChildren, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2273069862"
  }, ".tree.jsx-2273069862{padding-left:1.625rem;}")));
};

Tree.defaultProps = defaultProps;
Tree.displayName = 'GeistTree';
var Tree$1 = Tree;

Tree$1.File = TreeFile$1;
Tree$1.Folder = TreeFolder$1;

exports["default"] = Tree$1;
