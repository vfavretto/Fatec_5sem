import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DatabaseDriver } from '../types/database';

type DatabaseContextValue = {
  selectedDatabase: DatabaseDriver | null;
  isLoadingSelection: boolean;
  selectDatabase(driver: DatabaseDriver): Promise<void>;
  clearSelection(): Promise<void>;
};

const STORAGE_KEY = '@my-sql-react-app:database';

const DatabaseContext = createContext<DatabaseContextValue | undefined>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export function SelectedDatabaseProvider({ children }: ProviderProps) {
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseDriver | null>(null);
  const [isLoadingSelection, setIsLoadingSelection] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedValue === 'mongo' || storedValue === 'sqlite') {
          setSelectedDatabase(storedValue);
        }
      } catch (error) {
        console.warn('Não foi possível carregar a seleção de banco de dados.', error);
      } finally {
        setIsLoadingSelection(false);
      }
    })();
  }, []);

  const selectDatabase = async (driver: DatabaseDriver) => {
    setSelectedDatabase(driver);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, driver);
    } catch (error) {
      console.warn('Não foi possível salvar a seleção de banco de dados.', error);
    }
  };

  const clearSelection = async () => {
    setSelectedDatabase(null);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Não foi possível limpar a seleção de banco de dados.', error);
    }
  };

  const value = useMemo(
    () => ({
      selectedDatabase,
      isLoadingSelection,
      selectDatabase,
      clearSelection
    }),
    [selectedDatabase, isLoadingSelection]
  );

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase deve ser utilizado dentro de SelectedDatabaseProvider.');
  }
  return context;
}

