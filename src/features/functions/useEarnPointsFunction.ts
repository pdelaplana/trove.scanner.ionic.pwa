import { useMutation } from '@tanstack/react-query';

const useEarnPointsFunction = () => {
  const apiUrl = import.meta.env.VITE_CLOUD_FUNCTIONS_EARNPOINTS_URL;
  return useMutation({
    mutationFn: async ({
      membershipNumber,
      amount,
    }: {
      membershipNumber: string;
      amount: number;
    }) => {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_CLOUD_FUNCTIONS_API_KEY,
          },
          body: JSON.stringify({
            membershipNumber,
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

export default useEarnPointsFunction;
