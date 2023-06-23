import { StyleSheet, Text, View, LogBox } from 'react-native';
import Navigators from './src/navigators';

LogBox.ignoreAllLogs();//Ignore all log notifications

export default function App() {
  return (
    <Navigators />
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
