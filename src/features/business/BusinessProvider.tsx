import { Business } from '@src/domain';
import { createContext, ReactNode, useContext } from 'react';
import { LoyaltyProgram } from '@src/domain/entities/loyaltyProgram';

import useFetchApiKeyByBusinessId from '../queries/useFetchApiKeyByBusinessId';
import useFetchBusinessById from '../queries/useFetchBusinessById';
import useFetchLoyaltyProgramsByBusinessId from '../queries/useFetchLoyaltyProgramsByBusinessId';

type BusinessContextType = {
  business?: Business;
  loyaltyPrograms?: LoyaltyProgram[];
  apiKey: string;
  isLoading: boolean;
};

const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined
);

export const BusinessProvider: React.FC<{
  businessId: string;
  children: ReactNode;
}> = ({ businessId, children }) => {
  const {
    data: business,
    isLoading,
    refetch,
  } = useFetchBusinessById(businessId);

  const { data: loyaltyPrograms } = useFetchLoyaltyProgramsByBusinessId(
    business?.id ?? ''
  );

  const { data: apiKey } = useFetchApiKeyByBusinessId(business?.id ?? '');

  return (
    <BusinessContext.Provider
      value={{
        business: business ?? undefined,
        loyaltyPrograms,
        apiKey: apiKey ?? '',
        isLoading,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = (): BusinessContextType => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
function useFetchAllLoyaltyPrograms(): { data: any } {
  throw new Error('Function not implemented.');
}
