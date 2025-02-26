import { IonSelect, IonSelectOption } from '@ionic/react';
import {
  UseFormRegister,
  UseFormSetValue,
  FieldError,
  UseFormGetValues,
} from 'react-hook-form';
import ValidationError from './ValidationError';

type SelectOption = { label: string; value: string };

interface SelectFormFieldProps {
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
  onChange?: (e: CustomEvent) => void;
  optionsList: SelectOption[];
}

const SelectFormField: React.FC<SelectFormFieldProps> = ({
  name,
  label,
  placeholder,
  fill,
  register,
  getValues,
  setValue,
  validationRules,
  error,
  readonly = false,
  onChange,
  optionsList,
}) => (
  <>
    <IonSelect
      label={label}
      labelPlacement='floating'
      interface='popover'
      placeholder={placeholder ?? label}
      {...(fill ? { fill } : {})}
      {...(getValues
        ? {
            value: getValues(name),
          }
        : {})}
      {...(setValue
        ? {
            onIonChange: (e) =>
              setValue(name, e.detail.value, { shouldDirty: true }),
          }
        : {})}
    >
      {optionsList?.map((option) => (
        <IonSelectOption key={option.value} value={option.value}>
          {option.label}
        </IonSelectOption>
      ))}
    </IonSelect>

    <ValidationError error={error} />
  </>
);

export default SelectFormField;
