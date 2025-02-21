import { IonLoading, IonList, IonItem, IonLabel } from '@ionic/react';
import useGetLoyaltyCardInfoFunction from '@src/features/functions/useGetLoyaltyCardInfoFunction';
import { ActionButton } from '@src/pages/components/form';
import { useEffect } from 'react';
import { ScanCardPageState } from '../ScanCardPage';
import { useFormatters } from '@src/pages/components/hooks';
import EmptySection from '@src/pages/components/layouts/EmptySection';

interface ScanCardSearchResultsProps {
  membershipId: string;
  onCustomerLoyaltyCardFound: (membershipNumber: string) => void;
  onPageStateChange: (pageState: ScanCardPageState) => void;
}

const ScanCardSearchResults: React.FC<ScanCardSearchResultsProps> = ({
  membershipId,
  onCustomerLoyaltyCardFound,
  onPageStateChange,
}) => {
  const { data, isLoading } = useGetLoyaltyCardInfoFunction(membershipId);

  const { formatNumber, formatDate } = useFormatters();

  useEffect(() => {
    if (data && data?.membershipNumber) {
      onCustomerLoyaltyCardFound(data?.membershipNumber);
    }
  }, [data]);

  const handleBack = () => {
    onPageStateChange(ScanCardPageState.SEARCH);
  };

  const handleForward = () => {
    onPageStateChange(ScanCardPageState.ADD_TRANSACTION);
  };

  return (
    <>
      {isLoading && <IonLoading isOpen={isLoading} />}
      {data && !data?.id && (
        <>
          <EmptySection
            heading='Customer not found'
            content='No customer found with the provided membership number.'
          />
          <div className='ion-flex ion-justify-content-between'>
            <ActionButton
              label='Search Again'
              fill='clear'
              onClick={handleBack}
              isLoading={false}
              isDisabled={false}
            />
          </div>
        </>
      )}
      {data && data?.id && (
        <>
          <div className='ion-margin'>
            <h2>Review Customer</h2>
            <p>Click continue to add points for this customer.</p>
          </div>
          <IonList>
            <IonItem>
              <IonLabel>
                <h2>Membership Number</h2>
                <p>{data?.membershipNumber}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h2>Name</h2>
                <p>{data?.customerName}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h2>Email</h2>
                <p>{data?.customerEmail}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h2>Phone</h2>
                <p>{data?.customerPhone}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h2>Loyalty Program</h2>
                <p>{data?.loyaltyProgramName}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h2>Tier</h2>
                <p>{data?.tierName}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h2>Member Since</h2>
                <p>{formatDate(data?.membershipDate)}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h2>Available Points</h2>
                <p>{formatNumber(data?.rewardPoints)}</p>
              </IonLabel>
            </IonItem>
          </IonList>
          <div className='ion-flex ion-justify-content-between'>
            <ActionButton
              label='Search Again'
              fill='clear'
              onClick={handleBack}
              isLoading={false}
              isDisabled={false}
            />
            <ActionButton
              label='Continue'
              onClick={handleForward}
              isLoading={false}
              isDisabled={false}
            />
          </div>
        </>
      )}
    </>
  );
};
export default ScanCardSearchResults;
