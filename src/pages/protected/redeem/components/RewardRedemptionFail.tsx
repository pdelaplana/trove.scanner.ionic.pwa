import { RewardRedemptionPageState } from '../RewardRedemptionPage';
import { ActionButton } from '@src/pages/components/form';

interface RewardRedemptionFailProps {
  error: string;
  onPageStateChange: (pageState: RewardRedemptionPageState) => void;
}
const RewardRedemptionFail: React.FC<RewardRedemptionFailProps> = ({
  error,
  onPageStateChange,
}) => {
  return (
    <>
      <div className='ion-margin'>
        <h2>Transaction Failed</h2>
        <p>{error}</p>
      </div>
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
export default RewardRedemptionFail;
