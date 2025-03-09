import { IonList, IonItem, IonLabel, useIonRouter } from '@ionic/react';
import { InputFormField } from '@src/pages/components/form';
import ActionButton from '@src/pages/components/form/ActionButton';
import { Divider } from '@src/pages/components/ui/Divider';
import { ROUTES } from '@src/Routes';
import { SubmitHandler, useForm } from 'react-hook-form';

interface LoyaltyCardSearchFormProps {
  onSearchStarted: (searchTerm: string) => void;
}

const LoyaltyCardSearchForm: React.FC<LoyaltyCardSearchFormProps> = ({
  onSearchStarted,
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
      onSearchStarted(formData.searchTerm);
    }
  };

  const { push } = useIonRouter();

  return (
    <>
      <div className='ion-padding '>
        <h2>Reward Points</h2>
        <p>
          Scan the customer's loyalty QR code to add points to their account for
          their purchase
        </p>
      </div>

      <ActionButton
        label='Scan'
        expand='full'
        className='ion-margin'
        isLoading={isSubmitting}
        isDisabled={false}
        onClick={() => push(ROUTES.SCAN, 'forward')}
      />

      <Divider style={{ marginTop: '35px' }}>Or</Divider>
      <div className='ion-no-padding ion-padding-start ion-padding-end ion-padding-top'>
        <p> Enter customer's membership number, phone or email </p>
      </div>
      <form>
        <IonList lines='none'>
          <IonItem>
            <IonLabel>
              <InputFormField
                label='Membership No, Phone, Email or Rewards Code'
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
export default LoyaltyCardSearchForm;
