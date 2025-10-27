import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["children", "render", "dotBackdrop", "className", "dotSize", "dotSpace"];
import _JSXStyle from "../styled-jsx.es.js";
import React, { useEffect, useMemo, useState } from 'react';
import { tuple } from '../utils/prop-types';
import useTheme from '../use-theme';
import PageContent from './page-content';
import { hasChild } from '../utils/collections';
import useScale, { withScale } from '../use-scale';
var renderMode = tuple('default', 'effect', 'effect-seo');
var defaultProps = {
  render: 'default',
  dotBackdrop: false,
  dotSize: '1px',
  dotSpace: 1
};

var DotStyles = function DotStyles(_ref) {
  var dotSpace = _ref.dotSpace,
      dotSize = _ref.dotSize;
  var background = useMemo(function () {
    return {
      position: "calc(".concat(dotSpace, " * 25px)"),
      size: "calc(".concat(dotSpace, " * 50px)")
    };
  }, [dotSpace]);
  return /*#__PURE__*/React.createElement("span", {
    className: _JSXStyle.dynamic([["934717826", [dotSize, dotSize, background.position, background.position, background.size, background.size]]])
  }, /*#__PURE__*/React.createElement(_JSXStyle, {
    id: "934717826",
    dynamic: [dotSize, dotSize, background.position, background.position, background.size, background.size]
  }, "body{background-image:radial-gradient(#e3e3e3 ".concat(dotSize, ",transparent 0), radial-gradient(#e3e3e3 ").concat(dotSize, ",transparent 0);background-position:0 0,").concat(background.position, " ").concat(background.position, ";background-attachment:fixed;background-size:").concat(background.size, " ").concat(background.size, ";}")));
};

var PageComponent = function PageComponent(_ref2) {
  var children = _ref2.children,
      render = _ref2.render,
      dotBackdrop = _ref2.dotBackdrop,
      className = _ref2.className,
      dotSize = _ref2.dotSize,
      dotSpace = _ref2.dotSpace,
      props = _objectWithoutProperties(_ref2, _excluded);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var showDot = useMemo(function () {
    if (theme.type === 'dark') return false;
    return dotBackdrop;
  }, [dotBackdrop, theme.type]);

  var _useState = useState(render !== 'default'),
      _useState2 = _slicedToArray(_useState, 2),
      preventRender = _useState2[0],
      setPreventRender = _useState2[1];

  useEffect(function () {
    setPreventRender(false);
  }, []);

  if (preventRender) {
    var renderSEO = render === 'effect-seo';
    if (!renderSEO) return null;
    return /*#__PURE__*/React.createElement("div", {
      "aria-hidden": "true",
      className: "jsx-3942095687" + " " + "hidden"
    }, children, /*#__PURE__*/React.createElement(_JSXStyle, {
      id: "3942095687"
    }, ".hidden.jsx-3942095687{opacity:0;display:none;}"));
  }

  var hasContent = hasChild(children, PageContent);
  return /*#__PURE__*/React.createElement("section", _extends({}, props, {
    className: _JSXStyle.dynamic([["1515698274", [SCALES.font(1), SCALES.width(1, 'calc(100% - 100pt)'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(1.34), SCALES.pb(0), SCALES.pl(1.34), SCALES.mt(0), SCALES.mr(0, 'auto'), SCALES.mb(0), SCALES.ml(0, 'auto')]]]) + " " + (props && props.className != null && props.className || className || "")
  }), hasContent ? children : /*#__PURE__*/React.createElement(PageContent, null, children), showDot && /*#__PURE__*/React.createElement(DotStyles, {
    dotSize: dotSize,
    dotSpace: dotSpace
  }), /*#__PURE__*/React.createElement(_JSXStyle, {
    id: "1515698274",
    dynamic: [SCALES.font(1), SCALES.width(1, 'calc(100% - 100pt)'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(1.34), SCALES.pb(0), SCALES.pl(1.34), SCALES.mt(0), SCALES.mr(0, 'auto'), SCALES.mb(0), SCALES.ml(0, 'auto')]
  }, "section.__jsx-style-dynamic-selector{max-width:100vw;min-height:100vh;box-sizing:border-box;position:relative;font-size:".concat(SCALES.font(1), ";width:").concat(SCALES.width(1, 'calc(100% - 100pt)'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(1.34), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(1.34), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0, 'auto'), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0, 'auto'), ";}")));
};

PageComponent.defaultProps = defaultProps;
PageComponent.displayName = 'GeistPage';
var Page = withScale(PageComponent);
export default Page;