import { useBusiness } from '@src/features/business/BusinessProvider';
import { RewardRedemptionPageState } from '../RewardRedemptionPage';
import useRedeemRewardFunction from '@src/features/functions/useRedeemRewardFunction';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IonList, IonItem, IonLabel } from '@ionic/react';
import { InputFormField, ActionButton } from '@src/pages/components/form';

interface RewardRedemptionFinalizeFormProps {
  rewardCode: string;
  onPageStateChange: (pageState: RewardRedemptionPageState) => void;
}
const RewardRedemptionFinalizeForm: React.FC<
  RewardRedemptionFinalizeFormProps
> = ({ rewardCode, onPageStateChange }) => {
  const { apiKey } = useBusiness();
  const { mutateAsync: redeemRewardAsync } = useRedeemRewardFunction(apiKey);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting, isSubmitted },
  } = useForm<{ amount: number }>({
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit: SubmitHandler<{
    amount: number;
  }> = async (formData) => {
    if (formData) {
      const result = await redeemRewardAsync({
        rewardCode: rewardCode,
        amount: formData.amount,
      });
      if (result.error) {
        onPageStateChange({
          viewState: 'error',
          rewardCode: '',
          error: result.error,
        });
      } else {
        onPageStateChange({
          viewState: 'success',
          rewardCode: rewardCode,
          transaction: result.transaction,
        });
      }
    }
  };

  return (
    <>
      <form>
        <IonList lines='none'>
          <IonItem>
            <IonLabel>
              <InputFormField
                label='Purchase Amount'
                placeholder='Enter purchase amount to earn points'
                name='amount'
                fill='outline'
                register={register}
                setValue={setValue}
                type='number'
              />
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
          <ActionButton
            label='Redeem'
            className='ion-margin'
            isLoading={isSubmitting}
            isDisabled={!isDirty}
            onClick={handleSubmit(onSubmit)}
            style={{ width: '100px' }}
          />
        </div>
      </form>
    </>
  );
};
export default RewardRedemptionFinalizeForm;
