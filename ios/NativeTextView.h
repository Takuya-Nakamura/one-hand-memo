// ios/NativeTextView.h
#import <UIKit/UITextView.h>
#import <React/RCTComponent.h>

@interface NativeTextView : UITextView

@property(nonatomic, copy) RCTBubblingEventBlock onChange;
@property(nonatomic, copy) RCTBubblingEventBlock onFocus;
@property(nonatomic, copy) RCTBubblingEventBlock onBlur;


@end
