import React, { useEffect } from 'react';
import {
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonLoading,
  IonText,
  IonList,
  IonRouterLink,
  useIonRouter,
} from '@ionic/react';
import { useAuth } from '@features/auth/AuthProvider';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ValidationError } from '@pages/components/form';
import PublicPageLayout from '@pages/components/layouts/PublicPageLayout';
import { ROUTES } from '@src/Routes';

interface ISigninForm {
  password: string;
  email: string;
}

const SigninPage: React.FC = () => {
  const { signin, pendingUpdate, error, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ISigninForm>();

  const onSubmit: SubmitHandler<ISigninForm> = async (formData) => {
    const user = await signin(formData.email, formData.password);
    if (user) {
      console.debug('User logged in', user);
    }
  };

  const router = useIonRouter();

  useEffect(() => {
    if (error) {
      setError('root', {
        type: 'manual',
        message: 'Invalid email or password.  Try again or contact support.',
      });
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) router.push(ROUTES.SCAN, 'root', 'replace');
  }, [isAuthenticated]);

  return (
    <PublicPageLayout title='Sign in'>
      <IonList lines='none'>
        <form onSubmit={handleSubmit(onSubmit)}>
          {errors.root && (
            <IonItem>
              <IonLabel className='ion-text-center'>
                <IonText color='danger'>{errors.root.message}</IonText>
              </IonLabel>
            </IonItem>
          )}
          <IonItem>
            <IonLabel>
              <IonInput
                label='Email'
                labelPlacement='floating'
                type='email'
                fill='outline'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Enter a valid email address',
                  },
                })}
              />
              <ValidationError error={errors.email} />
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <IonInput
                label='Password'
                labelPlacement='floating'
                type='password'
                fill='outline'
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters long',
                  },
                })}
              />
              <ValidationError error={errors.password} />
            </IonLabel>
          </IonItem>

          <IonItem tabIndex={0}>
            <IonLabel>
              <IonButton
                size='default'
                expand='block'
                type='submit'
                disabled={pendingUpdate}
                className='ion-padding-top ion-padding-bottom'
              >
                Sign in
              </IonButton>
            </IonLabel>
          </IonItem>
        </form>

        <IonItem tabIndex={0}>
          <IonLabel className='ion-text-center'>
            <IonRouterLink href=''>Forgot Password?</IonRouterLink>
          </IonLabel>
        </IonItem>
      </IonList>
      <IonLoading isOpen={pendingUpdate} message={'Logging in...'} />
    </PublicPageLayout>
  );
};

export default SigninPage;
