import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SelectedDatabaseProvider, useDatabase } from './src/context/DatabaseContext';
import { SplashScreen } from './src/screens/SplashScreen';
import { BookListScreen } from './src/screens/BookListScreen';

function AppContent() {
  const { selectedDatabase, isLoadingSelection } = useDatabase();

  if (isLoadingSelection) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!selectedDatabase) {
    return <SplashScreen />;
  }

  return <BookListScreen />;
}

export default function App() {
  return (
    <SelectedDatabaseProvider>
      <AppContent />
    </SelectedDatabaseProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC'
  }
});
