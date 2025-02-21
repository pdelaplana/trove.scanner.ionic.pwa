import { LoyaltyCard } from '@src/domain';
import { useQuery } from '@tanstack/react-query';

const useGetLoyaltyCardInfoFunction = (membershipId: string) => {
  const apiUrl = import.meta.env.VITE_CLOUD_FUNCTIONS_GETLOYALTYCARDINFO_URL;
  return useQuery({
    queryKey: ['useGetLoyaltyCardInfoFunction', membershipId],
    queryFn: async () => {
      try {
        if (!membershipId) {
          return null;
        }
        const response = await fetch(`${apiUrl}?membershipId=${membershipId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_CLOUD_FUNCTIONS_API_KEY,
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
  });
};

export default useGetLoyaltyCardInfoFunction;
