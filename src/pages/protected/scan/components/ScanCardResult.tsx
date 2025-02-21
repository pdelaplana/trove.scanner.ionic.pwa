import { IonList, IonItem, IonLabel } from '@ionic/react';
import { LoyaltyCardTransaction } from '@src/domain';
import { ActionButton } from '@src/pages/components/form';
import { useFormatters } from '@src/pages/components/hooks';
import { ScanCardPageState } from '../ScanCardPage';

interface ScanCardResultProps {
  loyaltyCardTransaction: LoyaltyCardTransaction | null;
  onPageStateChange: (pageState: ScanCardPageState) => void;
}

const ScanCardResult: React.FC<ScanCardResultProps> = ({
  loyaltyCardTransaction,
  onPageStateChange,
}) => {
  const { formatCurrency, formatNumber } = useFormatters();
  return (
    <>
      <div className='ion-margin'>
        <h2>Transaction Completed</h2>
        <p>Loyalty points have been earned by this customer</p>
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
            <h2>Amount</h2>
            <p>
              {formatCurrency(
                loyaltyCardTransaction?.finalAmount,
                loyaltyCardTransaction?.currency
              )}
            </p>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <h2>Points Earned</h2>
            <p>{formatNumber(loyaltyCardTransaction?.totalPoints)}</p>
          </IonLabel>
        </IonItem>
      </IonList>
      <div className='ion-flex ion-justify-content-between'>
        <ActionButton
          label='Search Again'
          fill='clear'
          onClick={() => onPageStateChange(ScanCardPageState.SEARCH)}
          isLoading={false}
          isDisabled={false}
        />
      </div>
    </>
  );
};

export default ScanCardResult;
