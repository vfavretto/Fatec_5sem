import { StyleSheet, Text, View } from 'react-native';
import Campos from './components/revisao';

export default function App() {
  return (
    <View style={styles.container}>
      <Campos />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
