import { db } from '@src/infrastructure/firebase/firebase.config';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';

const decryptKey = async (encryptedKey: string) => {
  const apiUrl = import.meta.env.VITE_CLOUD_FUNCTIONS_DECRYPT_APIKEY_URL;
  const response = await fetch(`${apiUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      encryptedKey: encryptedKey,
    }),
  });
  return await response.json();
};

const useFetchApiKeyByBusinessId = (businessId: string) => {
  return useQuery({
    queryKey: ['useFetchApiKeyByBusinessId', businessId],
    queryFn: async () => {
      if (businessId === '') {
        return null;
      }
      try {
        const apiKeysCollectionRef = collection(db, 'apiKeys');
        const apiKeyQueryRef = query(
          apiKeysCollectionRef,
          where('businessId', '==', businessId)
        );

        const apiKeySnapshot = await getDocs(apiKeyQueryRef);
        const encryptedKey = apiKeySnapshot.docs[0].data().encryptedApiKey;

        const response = await decryptKey(encryptedKey);

        return response.decryptedKey;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  });
};

export default useFetchApiKeyByBusinessId;
