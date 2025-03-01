import BasePageLayout from '@src/pages/components/layouts/BasePageLayout';
import CenterContainer from '@src/pages/components/layouts/CenterContainer';

import CustomerEnrollmentForm from './components/CustomerEnrollmentForm';
import { useState } from 'react';
import CustomerEnrollmentSuccess from './components/CustomerEnrollmentSuccess';
import { LoyaltyCard } from '@src/domain';

type CustomerEnrollmentPageState = 'form' | 'success' | 'error';

const CustomerEnrollmentPage: React.FC = () => {
  const [pageState, setPageState] =
    useState<CustomerEnrollmentPageState>('form');

  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>(null);

  return (
    <BasePageLayout
      title='Enroll'
      showLogo={true}
      showBackButton={false}
      showProfileIcon={false}
      showSignoutButton={true}
    >
      <CenterContainer>
        {pageState === 'form' && (
          <CustomerEnrollmentForm
            onEnrollmentSuccess={(loyaltyCard) => {
              setLoyaltyCard(loyaltyCard);
              setPageState('success');
              console.log('Enrollment success', loyaltyCard);
            }}
          />
        )}
        {pageState === 'success' && loyaltyCard != null && (
          <CustomerEnrollmentSuccess
            loyaltyCard={loyaltyCard}
            onEnrollAnotherCustomer={() => {
              setLoyaltyCard(null);
              setPageState('form');
            }}
          />
        )}
      </CenterContainer>
    </BasePageLayout>
  );
};

export default CustomerEnrollmentPage;
