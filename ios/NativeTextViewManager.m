// ios/NativeTextViewManager.m
#import "NativeTextViewManager.h"

@implementation NativeTextViewManager

RCT_EXPORT_MODULE(NativeTextView)

// property
RCT_EXPORT_VIEW_PROPERTY(text, NSString)
RCT_EXPORT_VIEW_PROPERTY(keyboardType, NSString)
RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFocus, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onBlur, RCTBubblingEventBlock)
RCT_CUSTOM_VIEW_PROPERTY(nativeFocus, APPResignFirstResponder, UITextView)

{
  [view becomeFirstResponder];
}
RCT_CUSTOM_VIEW_PROPERTY(nativeBlur, APPResignFirstResponder, UITextView)
{
  [view endEditing:YES];
}

- (UIView *)view
{
  NativeTextView *textView = [[NativeTextView alloc] init];
  textView.delegate = self;
  textView.font = [UIFont systemFontOfSize: 20];

  return textView;
}

- (void)textViewDidChange:(NativeTextView *)textView {
    UITextRange *range = textView.markedTextRange;
    NSUInteger maxLength = 10000;
  
    if (!range && maxLength) {
        NSString *str = textView.text;
        if (str.length > maxLength) {
            str = [str substringToIndex:maxLength];
            textView.text = str;
        }
    }
  
    if (textView.onChange) {
        textView.onChange(@{@"text": textView.attributedText.string});
    }
}

- (void)keybordDissMiss:(UITapGestureRecognizer *)sender {
  [self.view endEditing: YES];
}



@end
