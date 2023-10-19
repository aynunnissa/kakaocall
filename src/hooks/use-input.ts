import { useState } from 'react';

const useInput = (validateValue: Function) => {
  const [enteredValue, setEnteredValue] = useState<string>('');
  const [isTouched, setIsTouched] = useState<boolean>(false);

  const valueIsValid = validateValue(enteredValue);
  const hasError = !valueIsValid && isTouched;

  const valueChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredValue(event.target.value);
  };

  const valueChangeManual = (val: string) => {
    setEnteredValue(val);
  };

  const defaultValueHandler = (val: string) => {
    setEnteredValue(val);
  };

  const inputBlurHandler = (event: React.SyntheticEvent): void => {
    setIsTouched(true);
  };

  const reset = () => {
    setEnteredValue('');
    setIsTouched(false);
  };

  return {
    value: enteredValue,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    valueChangeManual,
    defaultValueHandler,
    inputBlurHandler,
    reset,
  };
};

export default useInput;
