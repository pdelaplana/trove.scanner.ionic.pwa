import { LoyaltyCard } from '@src/domain';
import { useQuery } from '@tanstack/react-query';

const useGetLoyaltyCardInfoFunction = (lookupid: string, apikey: string) => {
  const apiUrl = import.meta.env.VITE_CLOUD_FUNCTIONS_GETLOYALTYCARDINFO_URL;
  return useQuery({
    queryKey: ['useGetLoyaltyCardInfoFunction', lookupid],
    queryFn: async () => {
      try {
        if (!lookupid || !apikey) {
          return null;
        }
        const response = await fetch(`${apiUrl}?lookupid=${lookupid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apikey,
          },
        });
        return { ...(await response.json()) } as LoyaltyCard & {
          customerName: string;
          customerEmail: string;
          customerPhone: string;
          businessName: string;
          loyaltyProgramName: string;
          tierName: string;
        };
      } catch (error) {
        throw new Error('Error fetching document: ' + error);
      }
    },
    enabled: () => {
      return !!apikey && !!lookupid;
    },
  });
};

export default useGetLoyaltyCardInfoFunction;
