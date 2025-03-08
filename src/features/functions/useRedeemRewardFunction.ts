import { useMutation } from '@tanstack/react-query';

const useRedeemRewardFunction = (apiKey: string) => {
  const apiUrl = import.meta.env.VITE_CLOUD_FUNCTIONS_REDEEMREWARD_URL;
  return useMutation({
    mutationFn: async ({
      rewardCode,
      amount,
    }: {
      rewardCode: string;
      amount: number;
    }) => {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
          body: JSON.stringify({
            rewardCode,
            amount,
          }),
        });
        return await response.json();
      } catch (error) {
        throw new Error('Error adding document: ' + error);
      }
    },
    onSuccess: (data) => {},
    onError: (error: unknown) => {
      console.error('Error adding document: ', error);
    },
  });
};

export default useRedeemRewardFunction;
