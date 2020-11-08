import {
  AppRegistry,
} from 'react-native';
import codePush from 'react-native-code-push';
import App from './src/App';

console.disableYellowBox = true;

if (!__DEV__) {
  console.log = () => {};
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE,
};

AppRegistry.registerComponent('vAppX', () =>
  codePush(codePushOptions)(App),
);

// AppRegistry.registerComponent('vAppX', () => App);
