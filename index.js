/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import MainScreen from './src/MainScreen'

AppRegistry.registerComponent(appName, () => MainScreen);