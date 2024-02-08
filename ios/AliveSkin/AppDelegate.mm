#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <RNScreenshotDetector/RNScreenshotDetector.h>
#import <React/RCTRootView.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  self.moduleName = @"AliveSkin";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
    //RCTRootView *rootView = [[RCTRootView alloc] init];

  
  self.initialProps = @{};
  

//  RNScreenshotDetector* screenshotDetector = [[RNScreenshotDetector alloc] init];
//  [screenshotDetector setupAndListen:rootView.bridge];
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
