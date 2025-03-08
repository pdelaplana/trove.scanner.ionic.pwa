import { CustomerReward, LoyaltyCard } from '@src/domain';
import { useQuery } from '@tanstack/react-query';

const useGetRewardInfoFunction = (rewardCode: string, apikey: string) => {
  const apiUrl = import.meta.env.VITE_CLOUD_FUNCTIONS_GETCUSTOMERREWARDINFO_URL;
  return useQuery({
    queryKey: ['useGetRewardInfoFunction', rewardCode],
    queryFn: async () => {
      try {
        if (!rewardCode || !apikey) {
          return null;
        }
        const response = await fetch(`${apiUrl}?rewardcode=${rewardCode}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apikey.toString(),
          },
        });
        return { ...(await response.json()) } as {
          customerReward: CustomerReward;
          loyaltyCard: LoyaltyCard;
        };
      } catch (error) {
        throw new Error('Error fetching document: ' + error);
      }
    },
    enabled: () => {
      return !!rewardCode && !!apikey;
    },
  });
};

export default useGetRewardInfoFunction;
