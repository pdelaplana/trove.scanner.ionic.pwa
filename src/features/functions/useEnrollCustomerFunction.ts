import { useMutation } from '@tanstack/react-query';

const useEnrollCustomerFunction = (apiKey: string) => {
  const apiUrl = import.meta.env.VITE_CLOUD_FUNCTIONS_ENROLLCUSTOMER_URL;
  return useMutation({
    mutationFn: async ({
      name,
      email,
      phone,
      loyaltyProgramNumber,
    }: {
      name: string;
      email: string;
      phone: string;
      loyaltyProgramNumber: string;
    }) => {
      if (!apiKey) {
        return null;
      }
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            loyaltyProgramNumber,
          }),
        });
        if (response.status !== 200) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.loyaltyCard;
      } catch (error) {
        throw new Error('Error enrolling customer: ' + error);
      }
    },
    //onSuccess: (data) => {},
    onError: (error) => {
      console.error(error);
      throw error;
    },
  });
};

export default useEnrollCustomerFunction;
