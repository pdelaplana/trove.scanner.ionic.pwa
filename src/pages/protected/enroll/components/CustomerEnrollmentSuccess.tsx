import { IonList, IonItem, IonLabel } from '@ionic/react';
import { LoyaltyCard } from '@src/domain';
import { ActionButton } from '@src/pages/components/form';
import { useFormatters } from '@src/pages/components/hooks';

interface CustomerEnrollmentSuccessProps {
  loyaltyCard: LoyaltyCard | null;
  onEnrollAnotherCustomer: () => void;
}
const CustomerEnrollmentSuccess: React.FC<CustomerEnrollmentSuccessProps> = ({
  loyaltyCard,
  onEnrollAnotherCustomer,
}) => {
  const { formatDate, formatNumber } = useFormatters();
  return (
    <>
      <div className='ion-padding'>
        <h2>Customer Details</h2>
        <p>Customer has been added</p>
      </div>
      <IonList>
        <IonItem>
          <IonLabel>
            <h2>Membership Number</h2>
            <p>{loyaltyCard?.membershipNumber}</p>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <h2>Name</h2>
            <p>{loyaltyCard?.customerName}</p>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <h2>Email</h2>
            <p>{loyaltyCard?.customerEmail}</p>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <h2>Phone</h2>
            <p>{loyaltyCard?.customerPhone}</p>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <h2>Loyalty Program</h2>
            <p>{loyaltyCard?.loyaltyProgramName}</p>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <h2>Tier</h2>
            <p>{loyaltyCard?.tierName}</p>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <h2>Member Since</h2>
            <p>{formatDate(loyaltyCard?.membershipDate)}</p>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <h2>Available Points</h2>
            <p>{formatNumber(loyaltyCard?.rewardPoints)}</p>
          </IonLabel>
        </IonItem>
      </IonList>
      <div className='ion-flex ion-justify-content-between'>
        <ActionButton
          label='Enroll Another Customer'
          fill='clear'
          onClick={onEnrollAnotherCustomer}
          isLoading={false}
          isDisabled={false}
        />
      </div>
    </>
  );
};
export default CustomerEnrollmentSuccess;
