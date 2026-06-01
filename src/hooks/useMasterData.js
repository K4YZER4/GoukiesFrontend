import { useContext } from 'react';
import { MasterDataContext } from '../context/MasterDataContext';

/**
 * Hook para acceder a datos maestros (marcas, tipos, unidades, ingredientes)
 * @returns {Object} { marcas, tipos, unidades, ingredientes, isLoading, error, reloadMasterData }
 */
export const useMasterData = () => {
  const context = useContext(MasterDataContext);
  
  if (!context) {
    throw new Error('useMasterData debe ser usado dentro de MasterDataProvider');
  }
  
  return context;
};

export default useMasterData;
