#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <RNScreenshotDetector/RNScreenshotDetector.h>
#import <React/RCTRootView.h>
#import "RNScreenshotDetector.h"



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
//  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL...]
//
//  RNScreenshotDetector* screenshotDetector = [[RNScreenshotDetector alloc] init];
//  [screenshotDetector setupAndListen:rootView.bridge];

  // Assuming this is within a method or a function
  RCTRootView *rootView = [RCTRootView alloc];

  // Initialize RNScreenshotDetector
  RNScreenshotDetector *screenshotDetector = [[RNScreenshotDetector alloc] init];
  if (screenshotDetector != nil) {
      // Setup and listen for screenshot events
      [screenshotDetector setupAndListen:rootView.bridge];
  } else {
      NSLog(@"Error: RNScreenshotDetector failed to initialize.");
  }
  
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
