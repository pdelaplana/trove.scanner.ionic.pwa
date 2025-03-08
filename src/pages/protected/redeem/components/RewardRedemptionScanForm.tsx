import { IonItem, IonLabel, IonList, useIonRouter } from '@ionic/react';
import { ActionButton, InputFormField } from '@src/pages/components/form';
import { Divider } from '@src/pages/components/ui/Divider';
import { useForm, SubmitHandler } from 'react-hook-form';
import { RewardRedemptionPageState } from '../RewardRedemptionPage';

interface RewardRedemptionScanFormProps {
  onPageStateChange: (pageState: RewardRedemptionPageState) => void;
}

const RewardRedemptionScanForm: React.FC<RewardRedemptionScanFormProps> = ({
  onPageStateChange,
}) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<{ searchTerm: string }>({
    defaultValues: {
      searchTerm: '',
    },
  });

  const onSubmit: SubmitHandler<{ searchTerm: string }> = async (formData) => {
    if (formData) {
      onPageStateChange({
        viewState: 'review',
        rewardCode: formData.searchTerm,
      });
    }
  };

  const { push } = useIonRouter();

  return (
    <>
      <div className='ion-padding '>
        <h2>Scan Reward QR Code</h2>
        <p>Scan reward QR code</p>
      </div>

      <ActionButton
        label='Scan'
        expand='full'
        className='ion-margin'
        isLoading={false}
        isDisabled={false}
        onClick={() => push('/scan-qrcode', 'forward')}
      />

      <Divider style={{ marginTop: '35px' }}>Or</Divider>

      <div className='ion-no-padding ion-padding-start ion-padding-end ion-padding-top'>
        <p> Enter the unique reward code </p>
      </div>
      <form>
        <IonList lines='none'>
          <IonItem>
            <IonLabel>
              <InputFormField
                label='Rewards Code'
                name='searchTerm'
                fill='outline'
                register={register}
                setValue={setValue}
              />
            </IonLabel>
          </IonItem>
        </IonList>
        <ActionButton
          label='Search'
          expand='full'
          className='ion-margin'
          isLoading={isSubmitting}
          isDisabled={!isDirty}
          onClick={handleSubmit(onSubmit)}
        />
      </form>
    </>
  );
};
export default RewardRedemptionScanForm;
