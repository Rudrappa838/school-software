
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, StatusBar, BackHandler, ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

// ✅ YOUR LIVE SITE URL (Connected!)
const WEBSITE_URL = 'https://school-software-tan.vercel.app/?is_mobile_app=true';

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  // 🔙 Handle Android Back Button (Go back in history instead of closing app)
  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false; // Exit app if no history
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [canGoBack]);

  // 🔄 Loading Screen
  const LoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4F46E5" />
      <Text style={styles.loadingText}>Loading School System...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Status bar matches your app theme */}
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <WebView
        ref={webViewRef}
        source={{ uri: WEBSITE_URL }}
        startInLoadingState={true}
        renderLoading={LoadingState}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
        }}
        // Enable file uploads/downloads
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        // Handle download requests if needed (basic)
        onFileDownload={({ nativeEvent }) => {
          const { downloadUrl } = nativeEvent;
          // You could add advanced download handling here
        }}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 100,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
