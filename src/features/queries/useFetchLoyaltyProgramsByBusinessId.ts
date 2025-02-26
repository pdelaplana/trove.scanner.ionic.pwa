import { LoyaltyProgram } from '@src/domain';
import { useQuery } from '@tanstack/react-query';
import { collection, doc, getDocs, query } from 'firebase/firestore';
import { db } from '@src/infrastructure/firebase/firebase.config';

const useFetchLoyaltyProgramsByBusinessId = (businessId: string) => {
  return useQuery({
    queryKey: ['useFetchLoyaltyProgramByBusinessId', businessId],
    queryFn: async () => {
      if (!businessId) {
        return [];
      }
      const businessRef = doc(db, 'businesses', businessId);
      const loyaltyProgramsSubcollectionRef = collection(
        businessRef,
        'loyaltyPrograms'
      );

      const querySnapshot = await getDocs(
        query(loyaltyProgramsSubcollectionRef)
      );

      const loyaltyPrograms: LoyaltyProgram[] = [];
      querySnapshot.forEach((doc) => {
        loyaltyPrograms.push({
          ...doc.data(),
          id: doc.id,
          businessId: doc.ref.parent.parent?.id,
        } as LoyaltyProgram);
      });

      return loyaltyPrograms;
    },
  });
};

export default useFetchLoyaltyProgramsByBusinessId;
