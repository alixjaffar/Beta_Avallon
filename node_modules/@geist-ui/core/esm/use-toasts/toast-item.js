import _JSXStyle from "../styled-jsx.es.js";
import React, { useMemo } from 'react';
import useTheme from '../use-theme';
import CssTransition from '../shared/css-transition';
import { makeToastActions, getColors, getTranslateByPlacement } from './helpers';
var ToastItem = /*#__PURE__*/React.memo(function (_ref) {
  var toast = _ref.toast,
      layout = _ref.layout;
  var theme = useTheme();

  var _useMemo = useMemo(function () {
    return getColors(theme.palette, toast.type);
  }, [theme.palette, toast.type]),
      color = _useMemo.color,
      bgColor = _useMemo.bgColor;

  var isReactNode = typeof toast.text !== 'string';
  var padding = layout.padding,
      margin = layout.margin,
      maxHeight = layout.maxHeight,
      maxWidth = layout.maxWidth,
      width = layout.width,
      placement = layout.placement;

  var _useMemo2 = useMemo(function () {
    return getTranslateByPlacement(placement);
  }, [placement]),
      enter = _useMemo2.enter,
      leave = _useMemo2.leave;

  return /*#__PURE__*/React.createElement(CssTransition, {
    name: "toast",
    visible: toast.visible,
    clearTime: 350
  }, /*#__PURE__*/React.createElement("div", {
    key: toast.id,
    className: _JSXStyle.dynamic([["1407001838", [width, maxWidth, maxHeight, theme.palette.foreground, bgColor, color, theme.layout.radius, theme.expressiveness.shadowSmall, theme.layout.gapHalf, enter, margin, padding, margin, padding, leave]]]) + " " + "toast"
  }, isReactNode ? toast.text : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: _JSXStyle.dynamic([["1407001838", [width, maxWidth, maxHeight, theme.palette.foreground, bgColor, color, theme.layout.radius, theme.expressiveness.shadowSmall, theme.layout.gapHalf, enter, margin, padding, margin, padding, leave]]]) + " " + "message"
  }, toast.text), /*#__PURE__*/React.createElement("div", {
    className: _JSXStyle.dynamic([["1407001838", [width, maxWidth, maxHeight, theme.palette.foreground, bgColor, color, theme.layout.radius, theme.expressiveness.shadowSmall, theme.layout.gapHalf, enter, margin, padding, margin, padding, leave]]]) + " " + "action"
  }, makeToastActions(toast.actions, toast.cancel))), /*#__PURE__*/React.createElement(_JSXStyle, {
    id: "1407001838",
    dynamic: [width, maxWidth, maxHeight, theme.palette.foreground, bgColor, color, theme.layout.radius, theme.expressiveness.shadowSmall, theme.layout.gapHalf, enter, margin, padding, margin, padding, leave]
  }, ".toast.__jsx-style-dynamic-selector{width:".concat(width, ";max-width:").concat(maxWidth, ";max-height:").concat(maxHeight, ";display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:").concat(theme.palette.foreground, ";background-color:").concat(bgColor, ";color:").concat(color, ";border:0;border-radius:").concat(theme.layout.radius, ";opacity:1;box-shadow:").concat(theme.expressiveness.shadowSmall, ";-webkit-transition:all 350ms cubic-bezier(0.1,0.2,0.1,1);transition:all 350ms cubic-bezier(0.1,0.2,0.1,1);overflow:hidden;}.message.__jsx-style-dynamic-selector{-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;height:100%;font-size:0.875em;display:-webkit-box;word-break:break-all;padding-right:").concat(theme.layout.gapHalf, ";overflow:hidden;max-height:100%;text-overflow:ellipsis;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-height:1.1rem;}.toast-enter.__jsx-style-dynamic-selector{opacity:0;height:0;padding:0;margin:0;-webkit-transform:").concat(enter, ";-ms-transform:").concat(enter, ";transform:").concat(enter, ";}.toast-enter-active.__jsx-style-dynamic-selector{opacity:1;height:auto;margin:").concat(margin, ";padding:").concat(padding, ";-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0);}.toast-leave.__jsx-style-dynamic-selector{opacity:1;-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0);height:auto;margin:").concat(margin, ";padding:").concat(padding, ";}.toast-leave-active.__jsx-style-dynamic-selector{opacity:0;-webkit-transform:").concat(leave, ";-ms-transform:").concat(leave, ";transform:").concat(leave, ";}"))));
});
export default ToastItem;