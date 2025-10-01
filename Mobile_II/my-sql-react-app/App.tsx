import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import createDatabase, { createTable, insertData } from './data/sqlite';

export default function App() {

  const Main = async () => {
    const db = await createDatabase();
    if (db) {
      createTable(db);
      insertData(db, 'John Doe', 'john.doe@example.com');
    }
  }

  useEffect(() => {
    Main();
  }, []);
  
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
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
