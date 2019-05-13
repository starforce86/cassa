APP MVP
How to run the project
npm install or yarn install
How to run on iOS simulator
react-native link
cd ios && pod install
cd ..
react-native run-ios
If you have CFBundleIdentifier error, please delete the ios/build folder and run react-native run-ios again.

How to run on Android
react-native run-android
You could also run android app, debugger and bundle in one terminal window by running the command yarn android.

Replace this file
    node_modules\react-native-html-to-pdf\android\src\main\java\android\print\PdfConverter.java


How to run on real iOS device.
Open the project with the ./ios/app.xcodeproj file.
Check Automatically manage signing and add your Apple ID.
Select connected device.
Alt text

Run Play.

If you had a bundle script load issue, please check these solutions:
https://github.com/facebook/react-native/issues/19774
cd ./node_modules/react-native/third-party/glog-0.3.4 && ../../scripts/ios-configure-glog.sh
If you had libfishhook.a issue
If you have duplicated errors
react-native unlink ...
https://github.com/facebook/react-native/issues/19569
https://github.com/react-native-community/lottie-react-native/issues/269
https://medium.com/@adityasingh_32512/solved-unable-to-load-script-from-assets-index-android-bundle-bdc5e3a3d5ff