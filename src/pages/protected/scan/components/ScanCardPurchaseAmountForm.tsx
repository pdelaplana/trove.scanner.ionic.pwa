import { LoyaltyCardTransaction } from '@src/domain';
import { ScanCardPageState } from '../ScanCardPage';
import { IonList, IonItem, IonLabel } from '@ionic/react';
import { InputFormField, ActionButton } from '@src/pages/components/form';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import useEarnPointsFunction from '@src/features/functions/useEarnPointsFunction';

interface ScanCardPurchaseAmountFormProps {
  membershipNumber?: string;
  onTransactionCompleted: (
    loyaltyCardTransaction: LoyaltyCardTransaction
  ) => void;
  onPageStateChange: (pageState: ScanCardPageState) => void;
}

const ScanCardPurchaseAmountForm: React.FC<ScanCardPurchaseAmountFormProps> = ({
  membershipNumber,
  onTransactionCompleted,
  onPageStateChange,
}) => {
  const { mutateAsync: earnPointsAsync } = useEarnPointsFunction();
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
      onPageStateChange(ScanCardPageState.RESULT);
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
            onClick={() => onPageStateChange(ScanCardPageState.SEARCH)}
            isLoading={false}
            isDisabled={false}
          />
          <ActionButton
            label='Add Transaction'
            className='ion-margin'
            isLoading={isSubmitting}
            isDisabled={!isDirty}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </>
  );
};

export default ScanCardPurchaseAmountForm;
