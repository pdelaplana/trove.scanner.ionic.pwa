import { LoyaltyCardTransaction } from '@src/domain';
import { LoyaltyCardPageState } from '../LoyaltyCardPage';
import { IonList, IonItem, IonLabel } from '@ionic/react';
import { InputFormField, ActionButton } from '@src/pages/components/form';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import useEarnPointsFunction from '@src/features/functions/useEarnPointsFunction';
import { useBusiness } from '@src/features/business/BusinessProvider';

interface LoyaltyCardPurchaseFormProps {
  membershipNumber?: string;
  onTransactionCompleted: (
    loyaltyCardTransaction: LoyaltyCardTransaction
  ) => void;
  onPageStateChange: (pageState: LoyaltyCardPageState) => void;
}

const LoyaltyCardPurchaseForm: React.FC<LoyaltyCardPurchaseFormProps> = ({
  membershipNumber,
  onTransactionCompleted,
  onPageStateChange,
}) => {
  const { apiKey } = useBusiness();
  const { mutateAsync: earnPointsAsync } = useEarnPointsFunction(apiKey);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<{ membershipNumber: string; amount: string }>({
    defaultValues: {
      membershipNumber: '',
      amount: '',
    },
  });

  const onSubmit: SubmitHandler<{
    membershipNumber: string;
    amount: string;
  }> = async (formData) => {
    if (formData) {
      const result = await earnPointsAsync({
        membershipNumber: formData.membershipNumber,
        amount: parseFloat(formData.amount),
      });
      onTransactionCompleted(result.transaction);
      onPageStateChange(LoyaltyCardPageState.RESULT);
      console.log(result);
    }
  };

  useEffect(() => {
    if (membershipNumber) {
      setValue('membershipNumber', membershipNumber);
    }
  }, [membershipNumber]);

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
            onClick={() => onPageStateChange(LoyaltyCardPageState.SEARCH)}
            isLoading={false}
            isDisabled={false}
          />
          <ActionButton
            label='Continue'
            className='ion-margin'
            isLoading={isSubmitting}
            isDisabled={!isDirty}
            onClick={handleSubmit(onSubmit)}
            style={{ width: '120px' }}
          />
        </div>
      </form>
    </>
  );
};

export default LoyaltyCardPurchaseForm;
