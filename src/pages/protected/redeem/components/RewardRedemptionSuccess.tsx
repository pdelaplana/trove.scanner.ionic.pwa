import { RewardRedemptionPageState } from '../RewardRedemptionPage';
import { IonList, IonItem, IonLabel } from '@ionic/react';
import { LoyaltyCardTransaction } from '@src/domain';
import { ActionButton } from '@src/pages/components/form';
import { useFormatters } from '@src/pages/components/hooks';

interface RewardRedemptionSuccessProps {
  loyaltyCardTransaction: LoyaltyCardTransaction;
  onPageStateChange: (pageState: RewardRedemptionPageState) => void;
}
const RewardRedemptionSuccess: React.FC<RewardRedemptionSuccessProps> = ({
  loyaltyCardTransaction,
  onPageStateChange,
}) => {
  const { formatCurrency } = useFormatters();
  return (
    <>
      <div className='ion-margin'>
        <h2>Transaction Completed</h2>
        <p>This customer reward has been succesfully redeemed.</p>
      </div>
      <IonList>
        <IonItem>
          <IonLabel>
            <h2>Loyalty Program</h2>
            <p>{loyaltyCardTransaction?.loyaltyProgramName}</p>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <h2>Final Amount</h2>
            <p>
              {formatCurrency(
                loyaltyCardTransaction?.finalAmount,
                loyaltyCardTransaction?.currency
              )}
            </p>
          </IonLabel>
        </IonItem>
      </IonList>
      <div className='ion-flex ion-justify-content-between'>
        <ActionButton
          label='Search Again'
          fill='clear'
          onClick={() =>
            onPageStateChange({ viewState: 'scan', rewardCode: '' })
          }
          isLoading={false}
          isDisabled={false}
        />
      </div>
    </>
  );
};
export default RewardRedemptionSuccess;
