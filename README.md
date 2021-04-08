# one_hand_memo


## 注意
admobのnode_moduleは修正が必要。installし直したら都度修正が必要。

```
# node_modules/react-native-admob/android/build.gradle

dependencies {
    implementation 'com.facebook.react:react-native:+'
    // implementation 'com.google.android.gms:play-services-ads:+' //commetn this line.
    implementation 'com.google.android.gms:play-services-ads:19.7.0' // add this line.

}
```
