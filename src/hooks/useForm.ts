import { useState } from 'react';

import type { ChangeEvent, Dispatch, SetStateAction } from 'react';

export function useForm<T extends Record<string, unknown>>(
  initialValues: T
): {
  values: T;
  handleChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  setValues: Dispatch<SetStateAction<T>>;
  resetForm: () => void;
} {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { value, name } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = (): void => {
    setValues(initialValues);
  };

  return {
    values,
    handleChange,
    setValues,
    resetForm,
  };
}
