import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["src", "disableSkeleton", "className", "maxDelay"];
import _JSXStyle from "../styled-jsx.es.js";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useTheme from '../use-theme';
import ImageSkeleton from './image.skeleton';
import { transformDataSource } from './helpers';
import useScale, { withScale } from '../use-scale';
import useClasses from '../use-classes';
var defaultProps = {
  disableSkeleton: false,
  className: '',
  maxDelay: 3000
};

var ImageComponent = function ImageComponent(_ref) {
  var src = _ref.src,
      disableSkeleton = _ref.disableSkeleton,
      className = _ref.className,
      maxDelay = _ref.maxDelay,
      props = _objectWithoutProperties(_ref, _excluded);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES,
      getScaleProps = _useScale.getScaleProps;

  var width = getScaleProps(['width', 'w']);
  var height = getScaleProps(['height', 'h']);
  var showAnimation = !disableSkeleton && width && height;
  var theme = useTheme();

  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = useState(true),
      _useState4 = _slicedToArray(_useState3, 2),
      showSkeleton = _useState4[0],
      setShowSkeleton = _useState4[1];

  var imageRef = useRef(null);
  var url = useMemo(function () {
    return transformDataSource(src);
  }, [src]);

  var imageLoaded = function imageLoaded() {
    if (!showAnimation) return;
    setLoading(false);
  };

  useEffect(function () {
    if (!showAnimation) return;
    if (!imageRef.current) return;

    if (imageRef.current.complete) {
      setLoading(false);
      setShowSkeleton(false);
    }
  });
  useEffect(function () {
    var timer = setTimeout(function () {
      if (showAnimation) {
        setShowSkeleton(false);
      }

      clearTimeout(timer);
    }, maxDelay);
    return function () {
      return clearTimeout(timer);
    };
  }, [loading]);
  return /*#__PURE__*/React.createElement("div", {
    className: _JSXStyle.dynamic([["4175752462", [theme.layout.radius, SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0, 'auto'), SCALES.mb(0), SCALES.ml(0, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.width(1, 'auto'), SCALES.height(1, 'auto')]]]) + " " + (useClasses('image', className) || "")
  }, showSkeleton && showAnimation && /*#__PURE__*/React.createElement(ImageSkeleton, {
    opacity: loading ? 0.5 : 0
  }), /*#__PURE__*/React.createElement("img", _extends({
    ref: imageRef,
    onLoad: imageLoaded,
    src: url
  }, props, {
    className: _JSXStyle.dynamic([["4175752462", [theme.layout.radius, SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0, 'auto'), SCALES.mb(0), SCALES.ml(0, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.width(1, 'auto'), SCALES.height(1, 'auto')]]]) + " " + (props && props.className != null && props.className || "")
  })), /*#__PURE__*/React.createElement(_JSXStyle, {
    id: "4175752462",
    dynamic: [theme.layout.radius, SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0, 'auto'), SCALES.mb(0), SCALES.ml(0, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.width(1, 'auto'), SCALES.height(1, 'auto')]
  }, ".image.__jsx-style-dynamic-selector{position:relative;border-radius:".concat(theme.layout.radius, ";overflow:hidden;max-width:100%;width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0, 'auto'), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";}img.__jsx-style-dynamic-selector{width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";object-fit:scale-down;display:inline-block;}")));
};

ImageComponent.defaultProps = defaultProps;
ImageComponent.displayName = 'GeistImage';
var Image = withScale(ImageComponent);
export default Image;