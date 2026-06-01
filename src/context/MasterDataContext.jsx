import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from './AuthContext';
import masterDataService from '../services/masterDataService';
import { masterDataStorage } from '../utils/localStorage';

/**
 * MasterDataContext
 * Proporciona acceso a datos globales (marcas, tipos, unidades, ingredientes)
 * que no dependen del usuario y se cargan una sola vez
 */
export const MasterDataContext = createContext();

export const MasterDataProvider = ({ children }) => {
  const { user } = useContext(AuthContext) || {};
  const [masterData, setMasterData] = useState({
    marca: [],
    tipo: [],
    unidad: [],
    ingredientes: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos maestros
  const loadMasterData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Verificar si hay datos en caché
      const cachedData = masterDataStorage.getMasterData();
      if (cachedData && cachedData.marca && cachedData.marca.length > 0) {
        console.log('✓ Master data loaded from cache');
        setMasterData(cachedData);
        return;
      }

      // Cargar desde API - pasa el id_usuario (requerido por el endpoint)
      console.log('📡 Fetching master data from API...');
      const data = await masterDataService.getAllMasterData(user.id);
      
      if (data) {
        console.log('✓ Master data fetched:', {
          marcas: data.marca?.length,
          tipos: data.tipo?.length,
          unidades: data.unidad?.length,
          ingredientes: data.ingredientes?.length,
        });
        setMasterData(data);
        masterDataStorage.setMasterData(data);
      }
    } catch (err) {
      console.error('❌ Error loading master data:', err);
      setError(err.message);
      
      // Intentar usar datos en caché si hay error
      const cachedData = masterDataStorage.getMasterData();
      if (cachedData) {
        console.log('⚠️ Using cached master data due to error');
        setMasterData(cachedData);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadMasterData();
  }, [loadMasterData]);

  const value = {
    masterData,
    isLoading,
    error,
    marcas: masterData.marca || [],
    tipos: masterData.tipo || [],
    unidades: masterData.unidad || [],
    ingredientes: masterData.ingredientes || [],
    reloadMasterData: loadMasterData,
  };

  return (
    <MasterDataContext.Provider value={value}>
      {children}
    </MasterDataContext.Provider>
  );
};

export default MasterDataContext;
