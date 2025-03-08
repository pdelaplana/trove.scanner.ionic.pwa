import { useBusiness } from '@src/features/business/BusinessProvider';
import useGetRewardInfoFunction from '@src/features/functions/useGetRewardInfoFunction';
import { RewardRedemptionPageState } from '../RewardRedemptionPage';
import { IonItem, IonLabel, IonList, IonLoading } from '@ionic/react';
import { ActionButton } from '@src/pages/components/form';
import EmptySection from '@src/pages/components/layouts/EmptySection';
import { useFormatters } from '@src/pages/components/hooks';

interface RewardRedemptionScanResultProps {
  rewardCode: string;
  onPageStateChange: (pageState: RewardRedemptionPageState) => void;
}

const NotFoundOrExpiredReward: React.FC<{
  handleBack: () => void;
  heading: string;
  message: string;
  buttonLabel: string;
}> = ({ handleBack, heading, message, buttonLabel }) => (
  <>
    <EmptySection heading={heading} content={message} />
    <div className='ion-flex ion-justify-content-center'>
      <ActionButton
        label={buttonLabel}
        fill='clear'
        onClick={handleBack}
        isLoading={false}
        isDisabled={false}
      />
    </div>
  </>
);

const RewardRedemptionScanResult: React.FC<RewardRedemptionScanResultProps> = ({
  rewardCode,
  onPageStateChange,
}) => {
  const { apiKey } = useBusiness();
  const { data, isLoading } = useGetRewardInfoFunction(
    rewardCode,
    apiKey ?? '' // Provide a default value or handle the undefined case
  );

  if (!apiKey || isLoading) {
    return <IonLoading isOpen={true} />;
  }

  const isExpired =
    data?.customerReward.expiryDate &&
    data?.customerReward.expiryDate < new Date();
  const isRedeemed = data?.customerReward.redeemedDate;

  const { formatDate } = useFormatters();

  const handleBack = () => {
    onPageStateChange({ viewState: 'scan', rewardCode: '' });
  };

  const handleForward = () => {
    onPageStateChange({
      viewState: 'finalize',
      rewardCode: data?.customerReward.id ?? '',
    });
  };

  return (
    <>
      {!isLoading && !data && (
        <NotFoundOrExpiredReward
          handleBack={handleBack}
          heading='Reward not found'
          message='No customer reward was found with that given number.'
          buttonLabel='Search Again'
        />
      )}
      {data && isExpired && (
        <NotFoundOrExpiredReward
          handleBack={handleBack}
          heading='Reward Expired'
          message='The reward has expired and cannot be redeemed.'
          buttonLabel='Search Again'
        />
      )}
      {data && isRedeemed && (
        <NotFoundOrExpiredReward
          handleBack={handleBack}
          heading='Reward Already Redeemed'
          message='The reward has already been redeemed.'
          buttonLabel='Search Again'
        />
      )}
      {data && !isExpired && !isRedeemed && (
        <>
          <div className='ion-margin'>
            <h2>Confirm Reward</h2>
            <p>Click continue to redeemm this reward.</p>
          </div>
          <IonList>
            <IonItem>
              <IonLabel>
                <h2>Reward Number</h2>
                <p>{data?.customerReward.id}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h2>Name</h2>
                <p>{data?.customerReward.name}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h2>Description</h2>
                <p>{data?.customerReward.description}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h2>Expires On</h2>
                <p>{formatDate(data?.customerReward.expiryDate)}</p>
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

export default RewardRedemptionScanResult;
