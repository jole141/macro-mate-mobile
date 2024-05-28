import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          'inter-black': require('../assets/fonts/Inter-Black.ttf'),
          'inter-bold': require('../assets/fonts/Inter-Bold.ttf'),
          'inter-extra-bold': require('../assets/fonts/Inter-ExtraBold.ttf'),
          'inter-extra-light': require('../assets/fonts/Inter-ExtraLight.ttf'),
          'inter-light': require('../assets/fonts/Inter-Light.ttf'),
          'inter-medium': require('../assets/fonts/Inter-Medium.ttf'),
          'inter-regular': require('../assets/fonts/Inter-Regular.ttf'),
          'inter-semi-bold': require('../assets/fonts/Inter-SemiBold.ttf'),
          'inter-thin': require('../assets/fonts/Inter-Thin.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
