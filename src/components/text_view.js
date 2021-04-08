// src/components/TextView.tsx
import React from 'react';
import { requireNativeComponent } from 'react-native';
const NativeTextView = requireNativeComponent('NativeTextView');

export class TextView extends React.Component {

  focus = () => {
    console.log("focus");
  }

  render() {
    const { onFocus, onBlur, nativeFocus, nativeBlur, defaultValue } = this.props;
    console.log("TextView", this.props);
    // console.log(this.props.defaultValue);

    return (
      <NativeTextView
        text={this.props.defaultValue}
        fontSize={40}
        {...this.props}
      />
    );
  }

}


