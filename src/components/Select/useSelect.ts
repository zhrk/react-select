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

  const { hideOptions, clearSearch } = selectProps;

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

  const clearValue = () => {
    setValue(null);
    clearSearch();
  };

  return {
    clearValue,
    selectOption,
    ...selectProps,
  };
};

export default useSelect;
