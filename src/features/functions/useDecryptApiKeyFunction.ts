import { LoyaltyCard } from '@src/domain';
import { useQuery } from '@tanstack/react-query';

const useDecryptApiKeyFunction = (encryptedKey: string) => {
  const apiUrl = import.meta.env.VITE_CLOUD_FUNCTIONS_GETLOYALTYCARDINFO_URL;
  return useQuery({
    queryKey: ['useDecryptApiKeyFunction', encryptedKey],
    queryFn: async () => {
      try {
        if (!encryptedKey) {
          return null;
        }
        const response = await fetch(`${apiUrl}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            encryptedKey,
          }),
        });
        return { ...(await response.json()) };
      } catch (error) {
        throw new Error('Error fetching function: ' + error);
      }
    },
  });
};

export default useDecryptApiKeyFunction;
