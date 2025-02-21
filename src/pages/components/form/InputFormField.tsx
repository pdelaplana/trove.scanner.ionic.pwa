import { IonInput } from '@ionic/react';
import ValidationError from './ValidationError';
import {
  FieldError,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';

interface InputFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  readonly?: boolean;
  fill?: 'outline' | 'solid';
  register?: UseFormRegister<any>;
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
  validationRules?: any;
  error?: FieldError;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'date';
  onChange?: (e: CustomEvent) => void;
  transformValue?: (value: string) => string;
}

const InputFormField: React.FC<InputFormFieldProps> = ({
  name,
  label,
  placeholder,
  fill,
  register,
  setValue,
  getValues,
  validationRules,
  error,
  type = 'text',
  readonly = false,
  transformValue,
}) => (
  <>
    <IonInput
      placeholder={placeholder ?? label}
      label={label}
      labelPlacement='floating'
      type={type}
      readonly={readonly}
      {...(readonly
        ? {
            style: {
              '--background': 'var(--ion-color-light-shade)',
              '--border-color': 'var(--ion-color-light-shade)',
              '--highlight-color-focused': 'var(--ion-color-dark)',
              '--border-width': 0,
            },
          }
        : {})}
      {...(fill ? { fill } : {})}
      {...(getValues ? { value: getValues(name) } : {})}
      {...(transformValue && getValues
        ? { value: transformValue(getValues(name) ?? '') }
        : {})}
      {...(register ? register(name, validationRules) : {})}
      {...(setValue
        ? {
            onIonChange: (e) => {
              setValue(name, e.detail.value, { shouldDirty: true });
            },
          }
        : {})}
    />
    <ValidationError error={error} />
  </>
);

export default InputFormField;
