import { useState, useEffect } from 'react';
import { Options, Option, Value, OnChange, GetOptions } from './types';
import useSelectCommon from './useSelectCommon';

interface Config {
  options?: Options;
  onChange?: OnChange;
  getOptions?: GetOptions;
}

const useSelect = (config: Config) => {
  const { options, onChange, getOptions } = config;

  const [value, setValue] = useState<Value>(null);

  const selectProps = useSelectCommon({ getOptions, options });

  const { inputProps, hideOptions, clearSearch } = selectProps;

  const { value: inputValue } = inputProps;

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value, onChange]);

  const selectOption = (option: Option) => {
    setValue(option);
    hideOptions();
    clearSearch();
  };

  const createOption = () => {
    setValue({ value: inputValue, label: inputValue });
    hideOptions();
    clearSearch();
  };

  const clearValue = () => {
    setValue(null);
    clearSearch();
  };

  return {
    clearValue,
    selectOption,
    createOption,
    ...selectProps,
  };
};

export default useSelect;
