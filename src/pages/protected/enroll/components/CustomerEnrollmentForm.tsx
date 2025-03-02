import { IonList, IonItem, IonLabel } from '@ionic/react';
import { LoyaltyCard, LoyaltyProgram } from '@src/domain';
import { useBusiness } from '@src/features/business/BusinessProvider';
import useEnrollCustomerFunction from '@src/features/functions/useEnrollCustomerFunction';
import {
  InputFormField,
  SelectFormField,
  ActionButton,
} from '@src/pages/components/form';
import { useAppNotifications } from '@src/pages/components/hooks';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js';
import { useMemo, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface CustomerEnrollmentFormData {
  name: string;
  email: string;
  phone: string;
  loyaltyProgramNumber: string;
}

interface CustomerEnrollmentFormProps {
  onEnrollmentSuccess: (loyaltyCard: LoyaltyCard) => void;
}

const CustomerEnrollmentForm: React.FC<CustomerEnrollmentFormProps> = ({
  onEnrollmentSuccess,
}) => {
  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>(null);
  const { business, loyaltyPrograms, apiKey } = useBusiness();
  const { showNotification, showErrorNotification } = useAppNotifications();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<CustomerEnrollmentFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      loyaltyProgramNumber: '',
    },
  });

  const {
    mutateAsync: enrollCustomer,
    error,
    isPending,
    isSuccess,
  } = useEnrollCustomerFunction(apiKey);

  const loyaltyProgramOptions = useMemo(() => {
    return (
      loyaltyPrograms?.map((lp: LoyaltyProgram) => ({
        value: lp.uniqueCode,
        label: lp.name,
      })) ?? []
    );
  }, [business, loyaltyPrograms]);

  const onSubmit: SubmitHandler<CustomerEnrollmentFormData> = async (
    formData
  ) => {
    const loyaltyCard = await enrollCustomer({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      loyaltyProgramNumber: formData.loyaltyProgramNumber,
    });
    setLoyaltyCard(loyaltyCard);
  };

  useEffect(() => {
    if (isSuccess) {
      showNotification('Customer enrolled successfully');
      reset();
    } else if (!isPending && error) {
      showErrorNotification('Failed to enroll customer');
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (loyaltyCard) {
      onEnrollmentSuccess(loyaltyCard as LoyaltyCard);
    }
  }, [loyaltyCard]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='ion-padding'>
        <h2>Enroll Customer</h2>
        <p>
          Fill in the customer details below to enroll them in a loyalty
          program.
        </p>
      </div>
      <IonList>
        <IonItem lines='none'>
          <IonLabel>
            <InputFormField
              name='name'
              label='Name'
              type='text'
              fill='outline'
              register={register}
              setValue={setValue}
              validationRules={{
                required: 'Name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters long',
                },
                maxLength: {
                  value: 50,
                  message: 'Name must be less than 50 characters',
                },
              }}
              error={errors?.name}
            />
          </IonLabel>
        </IonItem>
        <IonItem lines='none'>
          <IonLabel>
            <InputFormField
              name='email'
              label='Email'
              type='email'
              fill='outline'
              register={register}
              setValue={setValue}
              validationRules={{
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Invalid email address',
                },
              }}
              error={errors?.email}
            />
          </IonLabel>
        </IonItem>
        <IonItem lines='none'>
          <IonLabel>
            <InputFormField
              name='phone'
              label='Phone Number'
              type='tel'
              fill='outline'
              register={register}
              setValue={setValue}
              validationRules={{
                required: 'Phone is required',
                validate: (value: string) => {
                  try {
                    return (
                      isValidPhoneNumber(
                        value,
                        (business?.phoneCountryCode as CountryCode) ?? undefined
                      ) || 'Invalid phone number'
                    );
                  } catch (error) {
                    return 'Invalid phone number';
                  }
                },
              }}
              error={errors?.phone}
            />
          </IonLabel>
        </IonItem>
        <IonItem lines='none'>
          <IonLabel>
            <SelectFormField
              name='loyaltyProgramNumber'
              label='Loyalty Program'
              fill='outline'
              register={register}
              setValue={setValue}
              optionsList={loyaltyProgramOptions}
              error={errors?.loyaltyProgramNumber}
              validationRules={{ required: 'Loyalty program is required' }}
            />
          </IonLabel>
        </IonItem>
      </IonList>
      <ActionButton
        label='Enroll Customer'
        type='submit'
        expand='block'
        isLoading={isPending}
        isDisabled={!isDirty}
        className='ion-margin'
      />
    </form>
  );
};
export default CustomerEnrollmentForm;
