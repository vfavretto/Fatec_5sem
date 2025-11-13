import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SelectedDatabaseProvider, useDatabase } from './src/context/DatabaseContext';
import { SplashScreen } from './src/screens/SplashScreen';
import { MainNavigator } from './src/navigation/MainNavigator';
import { colors } from './src/theme/colors';
import { useState, useEffect } from 'react';

function AppContent() {
  const { selectedDatabase, isLoadingSelection } = useDatabase();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!isLoadingSelection && showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isLoadingSelection, showSplash]);

  if (isLoadingSelection) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (showSplash || !selectedDatabase) {
    return <SplashScreen onContinue={() => setShowSplash(false)} />;
  }

  return <MainNavigator />;
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
    backgroundColor: colors.background
  }
});
