import { IonList, IonItem, IonLabel, useIonRouter } from '@ionic/react';
import { InputFormField } from '@src/pages/components/form';
import ActionButton from '@src/pages/components/form/ActionButton';
import { SubmitHandler, useForm } from 'react-hook-form';

interface ScanCardSearchFormProps {
  onSearchStarted: (searchTerm: string) => void;
}

const ScanCardSearchForm: React.FC<ScanCardSearchFormProps> = ({
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
      <div className='ion-margin'>
        <h2>Add Points</h2>
        <p>Add loyalty points for purchases made by your customer.</p>
      </div>
      <form>
        <IonList lines='none'>
          <IonItem>
            <IonLabel>
              <InputFormField
                label='Customer Membership No, Phone No, or Email'
                placeholder='Provide a membership number, phone number, or email to identify the customer'
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
      <ActionButton
        label='Scan'
        expand='full'
        className='ion-margin'
        isLoading={isSubmitting}
        isDisabled={false}
        onClick={() => push('/scan-qrcode', 'forward')}
      />
    </>
  );
};
export default ScanCardSearchForm;
