import { IonList, IonItem, IonLabel, useIonRouter } from '@ionic/react';
import { InputFormField } from '@src/pages/components/form';
import ActionButton from '@src/pages/components/form/ActionButton';
import { Divider } from '@src/pages/components/ui/Divider';
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
        <h2>Scan Card</h2>
        <p>Scan customer's QR code</p>
      </div>

      <ActionButton
        label='Scan'
        expand='full'
        className='ion-margin'
        isLoading={isSubmitting}
        isDisabled={false}
        onClick={() => push('/scan-qrcode', 'forward')}
      />
      <Divider>Or</Divider>

      <form>
        <IonList lines='none'>
          <IonItem>
            <IonLabel>Enter membership number, phone, or email</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <InputFormField
                label='Membership No, Phone No, or Email'
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
export default ScanCardSearchForm;
