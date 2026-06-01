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
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 useMasterData Hook:', {
      marcas: context.marcas?.length || 0,
      tipos: context.tipos?.length || 0,
      unidades: context.unidades?.length || 0,
      ingredientes: context.ingredientes?.length || 0,
      isLoading: context.isLoading,
      hasError: !!context.error,
    });
  }
  
  return context;
};

export default useMasterData;
