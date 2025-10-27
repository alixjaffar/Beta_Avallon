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

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
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

var defaultProps$3 = {
  className: ''
};

var makeColgroup = function makeColgroup(width, columns) {
  var unsetWidthCount = columns.filter(function (c) {
    return !c.width;
  }).length;
  var customWidthTotal = columns.reduce(function (pre, current) {
    return current.width ? pre + current.width : pre;
  }, 0);
  var averageWidth = (width - customWidthTotal) / unsetWidthCount;
  if (averageWidth <= 0) return /*#__PURE__*/React__default["default"].createElement("colgroup", null);
  return /*#__PURE__*/React__default["default"].createElement("colgroup", null, columns.map(function (column, index) {
    return /*#__PURE__*/React__default["default"].createElement("col", {
      key: "colgroup-".concat(index),
      width: column.width || averageWidth
    });
  }));
};

var TableHead = function TableHead(props) {
  var theme = useTheme();
  var _ref = props,
      columns = _ref.columns,
      width = _ref.width;
  var isScalableWidth = React.useMemo(function () {
    return columns.find(function (item) {
      return !!item.width;
    });
  }, [columns]);
  var colgroup = React.useMemo(function () {
    if (!isScalableWidth) return /*#__PURE__*/React__default["default"].createElement("colgroup", null);
    return makeColgroup(width, columns);
  }, [isScalableWidth, width]);
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, colgroup, /*#__PURE__*/React__default["default"].createElement("thead", {
    className: styledJsx_cjs.style.dynamic([["134865897", [theme.palette.accents_5, theme.palette.accents_1, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius]]])
  }, /*#__PURE__*/React__default["default"].createElement("tr", {
    className: styledJsx_cjs.style.dynamic([["134865897", [theme.palette.accents_5, theme.palette.accents_1, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius]]])
  }, columns.map(function (column, index) {
    return /*#__PURE__*/React__default["default"].createElement("th", {
      key: "table-th-".concat(column.prop, "-").concat(index),
      className: styledJsx_cjs.style.dynamic([["134865897", [theme.palette.accents_5, theme.palette.accents_1, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius]]]) + " " + (column.className || "")
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: styledJsx_cjs.style.dynamic([["134865897", [theme.palette.accents_5, theme.palette.accents_1, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius]]]) + " " + "thead-box"
    }, column.label));
  }))), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "134865897",
    dynamic: [theme.palette.accents_5, theme.palette.accents_1, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius]
  }, "thead.__jsx-style-dynamic-selector{border-collapse:separate;border-spacing:0;font-size:inherit;}th.__jsx-style-dynamic-selector{padding:0 0.5em;font-size:calc(0.75 * var(--table-font-size));font-weight:normal;text-align:left;-webkit-letter-spacing:0;-moz-letter-spacing:0;-ms-letter-spacing:0;letter-spacing:0;vertical-align:middle;min-height:calc(2.5 * var(--table-font-size));color:".concat(theme.palette.accents_5, ";background:").concat(theme.palette.accents_1, ";border-bottom:1px solid ").concat(theme.palette.border, ";border-top:1px solid ").concat(theme.palette.border, ";border-radius:0;}th.__jsx-style-dynamic-selector:nth-child(1){border-bottom:1px solid ").concat(theme.palette.border, ";border-left:1px solid ").concat(theme.palette.border, ";border-top:1px solid ").concat(theme.palette.border, ";border-top-left-radius:").concat(theme.layout.radius, ";border-bottom-left-radius:").concat(theme.layout.radius, ";}th.__jsx-style-dynamic-selector:last-child{border-bottom:1px solid ").concat(theme.palette.border, ";border-right:1px solid ").concat(theme.palette.border, ";border-top:1px solid ").concat(theme.palette.border, ";border-top-right-radius:").concat(theme.layout.radius, ";border-bottom-right-radius:").concat(theme.layout.radius, ";}.thead-box.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-align:center;min-height:calc(2.5 * var(--table-font-size));text-transform:uppercase;}")));
};

TableHead.defaultProps = defaultProps$3;
TableHead.displayName = 'GeistTableHead';
var TableHead$1 = TableHead;

var TableCell = function TableCell(_ref) {
  var columns = _ref.columns,
      row = _ref.row,
      rowIndex = _ref.rowIndex,
      emptyText = _ref.emptyText,
      onCellClick = _ref.onCellClick;

  /* eslint-disable react/jsx-no-useless-fragment */
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, columns.map(function (column, index) {
    var currentRowValue = row[column.prop];
    var cellValue = currentRowValue || emptyText;
    var shouldBeRenderElement = column.renderHandler(currentRowValue, row, rowIndex);
    return /*#__PURE__*/React__default["default"].createElement("td", {
      key: "row-td-".concat(index, "-").concat(column.prop),
      onClick: function onClick() {
        return onCellClick && onCellClick(currentRowValue, rowIndex, index);
      },
      className: column.className
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "cell"
    }, shouldBeRenderElement ? shouldBeRenderElement : cellValue));
  }));
  /* eslint-enable */
};

var TableCell$1 = TableCell;

var defaultContext$1 = {
  columns: [],
  updateColumn: function updateColumn() {}
};
var TableContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$1);
var useTableContext = function useTableContext() {
  return React__default["default"].useContext(TableContext);
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

var defaultProps$2 = {
  className: ''
};

var TableBody = function TableBody(_ref) {
  var data = _ref.data,
      hover = _ref.hover,
      emptyText = _ref.emptyText,
      onRow = _ref.onRow,
      onCell = _ref.onCell,
      rowClassName = _ref.rowClassName;
  var theme = useTheme();

  var _useTableContext = useTableContext(),
      columns = _useTableContext.columns;

  var rowClickHandler = function rowClickHandler(row, index) {
    onRow && onRow(row, index);
  };

  return /*#__PURE__*/React__default["default"].createElement("tbody", {
    className: styledJsx_cjs.style.dynamic([["3433300570", [theme.palette.accents_1, theme.palette.border, theme.palette.accents_6]]])
  }, data.map(function (row, index) {
    var className = rowClassName(row, index);
    return /*#__PURE__*/React__default["default"].createElement("tr", {
      key: "tbody-row-".concat(index),
      onClick: function onClick() {
        return rowClickHandler(row, index);
      },
      className: styledJsx_cjs.style.dynamic([["3433300570", [theme.palette.accents_1, theme.palette.border, theme.palette.accents_6]]]) + " " + (useClasses$1({
        hover: hover
      }, className) || "")
    }, /*#__PURE__*/React__default["default"].createElement(TableCell$1, {
      columns: columns,
      row: row,
      rowIndex: index,
      emptyText: emptyText,
      onCellClick: onCell
    }));
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3433300570",
    dynamic: [theme.palette.accents_1, theme.palette.border, theme.palette.accents_6]
  }, "tr.__jsx-style-dynamic-selector{-webkit-transition:background-color 0.25s ease;transition:background-color 0.25s ease;font-size:inherit;}tr.hover.__jsx-style-dynamic-selector:hover{background-color:".concat(theme.palette.accents_1, ";}tr.__jsx-style-dynamic-selector td{padding:0 0.5em;border-bottom:1px solid ").concat(theme.palette.border, ";color:").concat(theme.palette.accents_6, ";font-size:calc(0.875 * var(--table-font-size));text-align:left;}tr.__jsx-style-dynamic-selector .cell{min-height:calc(3.125 * var(--table-font-size));display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-flex-flow:row wrap;-ms-flex-flow:row wrap;flex-flow:row wrap;}")));
};

TableBody.defaultProps = defaultProps$2;
TableBody.displayName = 'GeistTableBody';
var TableBody$1 = TableBody;

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

var useResize = function useResize(callback) {
  var immediatelyInvoke = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  React.useEffect(function () {
    var fn = function fn() {
      return callback();
    };

    if (immediatelyInvoke) {
      fn();
    }

    window.addEventListener('resize', fn);
    return function () {
      return window.removeEventListener('resize', fn);
    };
  }, []);
};

var useResize$1 = useResize;

var ScalePropKeys = ['width', 'height', 'padding', 'margin', 'w', 'h', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'pl', 'pr', 'pt', 'pb', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'ml', 'mr', 'mt', 'mb', 'px', 'py', 'mx', 'my', 'font', 'unit', 'scale'];

var defaultDynamicLayoutPipe = function defaultDynamicLayoutPipe(scale1x) {
  return "".concat(scale1x);
};

var defaultContext = {
  getScaleProps: function getScaleProps() {
    return undefined;
  },
  getAllScaleProps: function getAllScaleProps() {
    return {};
  },
  SCALES: {
    pl: defaultDynamicLayoutPipe,
    pr: defaultDynamicLayoutPipe,
    pb: defaultDynamicLayoutPipe,
    pt: defaultDynamicLayoutPipe,
    px: defaultDynamicLayoutPipe,
    py: defaultDynamicLayoutPipe,
    mb: defaultDynamicLayoutPipe,
    ml: defaultDynamicLayoutPipe,
    mr: defaultDynamicLayoutPipe,
    mt: defaultDynamicLayoutPipe,
    mx: defaultDynamicLayoutPipe,
    my: defaultDynamicLayoutPipe,
    width: defaultDynamicLayoutPipe,
    height: defaultDynamicLayoutPipe,
    font: defaultDynamicLayoutPipe
  },
  unit: '16px'
};
var ScaleContext = /*#__PURE__*/React__default["default"].createContext(defaultContext);
var useScale$1 = function useScale() {
  return React__default["default"].useContext(ScaleContext);
};

var isCSSNumberValue = function isCSSNumberValue(value) {
  return value !== undefined && !Number.isNaN(+value);
};

var generateGetScaleProps = function generateGetScaleProps(props) {
  var getScaleProps = function getScaleProps(keyOrKeys) {
    if (!Array.isArray(keyOrKeys)) return props[keyOrKeys];
    var value = undefined;

    var _iterator = _createForOfIteratorHelper(keyOrKeys),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var key = _step.value;
        var currentValue = props[key];

        if (typeof currentValue !== 'undefined') {
          value = currentValue;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return value;
  };

  return getScaleProps;
};
var generateGetAllScaleProps = function generateGetAllScaleProps(props) {
  var getAllScaleProps = function getAllScaleProps() {
    var scaleProps = {};

    var _iterator2 = _createForOfIteratorHelper(ScalePropKeys),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var key = _step2.value;
        var value = props[key];

        if (typeof value !== 'undefined') {
          scaleProps[key] = value;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    return scaleProps;
  };

  return getAllScaleProps;
};

var _excluded$1 = ["children"],
    _excluded2 = ["paddingLeft", "pl", "paddingRight", "pr", "paddingTop", "pt", "paddingBottom", "pb", "marginTop", "mt", "marginRight", "mr", "marginBottom", "mb", "marginLeft", "ml", "px", "py", "mx", "my", "width", "height", "font", "w", "h", "margin", "padding", "unit", "scale"];

var reduceScaleCoefficient = function reduceScaleCoefficient(scale) {
  if (scale === 1) return scale;
  var diff = Math.abs((scale - 1) / 2);
  return scale > 1 ? 1 + diff : 1 - diff;
};

var withScale = function withScale(Render) {
  var ScaleFC = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
    var _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref27, _ref28, _ref29, _ref30, _ref31, _ref32, _ref33;

    var children = _ref.children,
        props = _objectWithoutProperties(_ref, _excluded$1);

    var _useTheme = useTheme(),
        layout = _useTheme.layout;

    var paddingLeft = props.paddingLeft,
        pl = props.pl,
        paddingRight = props.paddingRight,
        pr = props.pr,
        paddingTop = props.paddingTop,
        pt = props.pt,
        paddingBottom = props.paddingBottom,
        pb = props.pb,
        marginTop = props.marginTop,
        mt = props.mt,
        marginRight = props.marginRight,
        mr = props.mr,
        marginBottom = props.marginBottom,
        mb = props.mb,
        marginLeft = props.marginLeft,
        ml = props.ml,
        px = props.px,
        py = props.py,
        mx = props.mx,
        my = props.my,
        width = props.width,
        height = props.height,
        font = props.font,
        w = props.w,
        h = props.h,
        margin = props.margin,
        padding = props.padding,
        _props$unit = props.unit,
        unit = _props$unit === void 0 ? layout.unit : _props$unit,
        _props$scale = props.scale,
        scale = _props$scale === void 0 ? 1 : _props$scale,
        innerProps = _objectWithoutProperties(props, _excluded2);

    var makeScaleHandler = function makeScaleHandler(attrValue) {
      return function (scale1x, defaultValue) {
        // 0 means disable scale and the default value is 0
        if (scale1x === 0) {
          scale1x = 1;
          defaultValue = defaultValue || 0;
        }

        var factor = reduceScaleCoefficient(scale) * scale1x;

        if (typeof attrValue === 'undefined') {
          if (typeof defaultValue !== 'undefined') return "".concat(defaultValue);
          return "calc(".concat(factor, " * ").concat(unit, ")");
        }

        if (!isCSSNumberValue(attrValue)) return "".concat(attrValue);
        var customFactor = factor * Number(attrValue);
        return "calc(".concat(customFactor, " * ").concat(unit, ")");
      };
    };

    var value = {
      unit: unit,
      SCALES: {
        pt: makeScaleHandler((_ref2 = (_ref3 = paddingTop !== null && paddingTop !== void 0 ? paddingTop : pt) !== null && _ref3 !== void 0 ? _ref3 : py) !== null && _ref2 !== void 0 ? _ref2 : padding),
        pr: makeScaleHandler((_ref4 = (_ref5 = paddingRight !== null && paddingRight !== void 0 ? paddingRight : pr) !== null && _ref5 !== void 0 ? _ref5 : px) !== null && _ref4 !== void 0 ? _ref4 : padding),
        pb: makeScaleHandler((_ref6 = (_ref7 = paddingBottom !== null && paddingBottom !== void 0 ? paddingBottom : pb) !== null && _ref7 !== void 0 ? _ref7 : py) !== null && _ref6 !== void 0 ? _ref6 : padding),
        pl: makeScaleHandler((_ref8 = (_ref9 = paddingLeft !== null && paddingLeft !== void 0 ? paddingLeft : pl) !== null && _ref9 !== void 0 ? _ref9 : px) !== null && _ref8 !== void 0 ? _ref8 : padding),
        px: makeScaleHandler((_ref10 = (_ref11 = (_ref12 = (_ref13 = px !== null && px !== void 0 ? px : paddingLeft) !== null && _ref13 !== void 0 ? _ref13 : paddingRight) !== null && _ref12 !== void 0 ? _ref12 : pl) !== null && _ref11 !== void 0 ? _ref11 : pr) !== null && _ref10 !== void 0 ? _ref10 : padding),
        py: makeScaleHandler((_ref14 = (_ref15 = (_ref16 = (_ref17 = py !== null && py !== void 0 ? py : paddingTop) !== null && _ref17 !== void 0 ? _ref17 : paddingBottom) !== null && _ref16 !== void 0 ? _ref16 : pt) !== null && _ref15 !== void 0 ? _ref15 : pb) !== null && _ref14 !== void 0 ? _ref14 : padding),
        mt: makeScaleHandler((_ref18 = (_ref19 = marginTop !== null && marginTop !== void 0 ? marginTop : mt) !== null && _ref19 !== void 0 ? _ref19 : my) !== null && _ref18 !== void 0 ? _ref18 : margin),
        mr: makeScaleHandler((_ref20 = (_ref21 = marginRight !== null && marginRight !== void 0 ? marginRight : mr) !== null && _ref21 !== void 0 ? _ref21 : mx) !== null && _ref20 !== void 0 ? _ref20 : margin),
        mb: makeScaleHandler((_ref22 = (_ref23 = marginBottom !== null && marginBottom !== void 0 ? marginBottom : mb) !== null && _ref23 !== void 0 ? _ref23 : my) !== null && _ref22 !== void 0 ? _ref22 : margin),
        ml: makeScaleHandler((_ref24 = (_ref25 = marginLeft !== null && marginLeft !== void 0 ? marginLeft : ml) !== null && _ref25 !== void 0 ? _ref25 : mx) !== null && _ref24 !== void 0 ? _ref24 : margin),
        mx: makeScaleHandler((_ref26 = (_ref27 = (_ref28 = (_ref29 = mx !== null && mx !== void 0 ? mx : marginLeft) !== null && _ref29 !== void 0 ? _ref29 : marginRight) !== null && _ref28 !== void 0 ? _ref28 : ml) !== null && _ref27 !== void 0 ? _ref27 : mr) !== null && _ref26 !== void 0 ? _ref26 : margin),
        my: makeScaleHandler((_ref30 = (_ref31 = (_ref32 = (_ref33 = my !== null && my !== void 0 ? my : marginTop) !== null && _ref33 !== void 0 ? _ref33 : marginBottom) !== null && _ref32 !== void 0 ? _ref32 : mt) !== null && _ref31 !== void 0 ? _ref31 : mb) !== null && _ref30 !== void 0 ? _ref30 : margin),
        width: makeScaleHandler(width !== null && width !== void 0 ? width : w),
        height: makeScaleHandler(height !== null && height !== void 0 ? height : h),
        font: makeScaleHandler(font)
      },
      getScaleProps: generateGetScaleProps(props),
      getAllScaleProps: generateGetAllScaleProps(props)
    };
    return /*#__PURE__*/React__default["default"].createElement(ScaleContext.Provider, {
      value: value
    }, /*#__PURE__*/React__default["default"].createElement(Render, _extends({}, innerProps, {
      ref: ref
    }), children));
  });
  ScaleFC.displayName = "Scale".concat(Render.displayName || 'Wrapper');
  return ScaleFC;
};

var withScale$1 = withScale;

var useScale = useScale$1;

var warningStack = {};

var useWarning = function useWarning(message, component) {
  var tag = component ? " [".concat(component, "]") : ' ';
  var log = "[Geist UI]".concat(tag, ": ").concat(message);
  if (typeof console === 'undefined') return;
  if (warningStack[log]) return;
  warningStack[log] = true;

  if (process.env.NODE_ENV !== 'production') {
    return console.error(log);
  }

  console.warn(log);
};

var useWarning$1 = useWarning;

var defaultProps$1 = {
  className: '',
  render: function render() {}
};

var TableColumn = function TableColumn(columnProps) {
  var _ref = columnProps,
      children = _ref.children,
      prop = _ref.prop,
      label = _ref.label,
      width = _ref.width,
      className = _ref.className,
      renderHandler = _ref.render;

  var _useTableContext = useTableContext(),
      updateColumn = _useTableContext.updateColumn;

  var safeProp = "".concat(prop).trim();

  if (!safeProp) {
    useWarning$1('The props "prop" is required.', 'Table.Column');
  }

  React.useEffect(function () {
    updateColumn({
      label: children || label,
      prop: safeProp,
      width: width,
      className: className,
      renderHandler: renderHandler
    });
  }, [children, label, prop, width, className, renderHandler]);
  return null;
};

TableColumn.defaultProps = defaultProps$1;
TableColumn.displayName = 'GeistTableColumn';
var TableColumn$1 = TableColumn;

var _excluded = ["children", "data", "initialData", "hover", "emptyText", "onRow", "onCell", "onChange", "className", "rowClassName"];
var defaultProps = {
  hover: true,
  initialData: [],
  emptyText: '',
  className: '',
  rowClassName: function rowClassName() {
    return '';
  }
};

function TableComponent(tableProps) {
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  var _ref = tableProps,
      children = _ref.children,
      customData = _ref.data,
      initialData = _ref.initialData,
      hover = _ref.hover,
      emptyText = _ref.emptyText,
      onRow = _ref.onRow,
      onCell = _ref.onCell;
      _ref.onChange;
      var className = _ref.className,
      rowClassName = _ref.rowClassName,
      props = _objectWithoutProperties(_ref, _excluded);
  /* eslint-enable @typescript-eslint/no-unused-vars */


  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var ref = React.useRef(null);

  var _useRealShape = useRealShape$1(ref),
      _useRealShape2 = _slicedToArray(_useRealShape, 2),
      width = _useRealShape2[0].width,
      updateShape = _useRealShape2[1];

  var _useState = React.useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      columns = _useState2[0],
      setColumns = _useState2[1];

  var _useState3 = React.useState(initialData),
      _useState4 = _slicedToArray(_useState3, 2),
      data = _useState4[0],
      setData = _useState4[1];

  var updateColumn = function updateColumn(column) {
    setColumns(function (last) {
      var hasColumn = last.find(function (item) {
        return item.prop === column.prop;
      });
      if (!hasColumn) return [].concat(_toConsumableArray(last), [column]);
      return last.map(function (item) {
        if (item.prop !== column.prop) return item;
        return column;
      });
    });
  };

  var contextValue = React.useMemo(function () {
    return {
      columns: columns,
      updateColumn: updateColumn
    };
  }, [columns]);
  React.useEffect(function () {
    if (typeof customData === 'undefined') return;
    setData(customData);
  }, [customData]);
  useResize$1(function () {
    return updateShape();
  });
  return /*#__PURE__*/React__default["default"].createElement(TableContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React__default["default"].createElement("table", _extends({
    ref: ref
  }, props, {
    className: styledJsx_cjs.style.dynamic([["2132340556", [SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || className || "")
  }), /*#__PURE__*/React__default["default"].createElement(TableHead$1, {
    columns: columns,
    width: width
  }), /*#__PURE__*/React__default["default"].createElement(TableBody$1, {
    data: data,
    hover: hover,
    emptyText: emptyText,
    onRow: onRow,
    onCell: onCell,
    rowClassName: rowClassName
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2132340556",
    dynamic: [SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, "table.__jsx-style-dynamic-selector{border-collapse:separate;border-spacing:0;--table-font-size:".concat(SCALES.font(1), ";font-size:var(--table-font-size);width:").concat(SCALES.width(1, '100%'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}"))));
}

TableComponent.defaultProps = defaultProps;
TableComponent.displayName = 'GeistTable';
TableComponent.Column = TableColumn$1;
var Table = withScale$1(TableComponent);
Table.Column = TableColumn$1;
var Table$1 = Table;

exports["default"] = Table$1;
