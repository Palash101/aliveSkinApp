/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App'; // Import your main component
import {name as appName} from './app.json';
import {initializeApp} from '@react-native-firebase/app';

const firebaseConfig = {
  // Your Firebase configuration object
};

initializeApp(firebaseConfig);

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  // Render the app component on foreground launch
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
