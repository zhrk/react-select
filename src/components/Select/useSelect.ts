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

  const { visible, hideOptions, clearSearch, ...rest } = useSelectCommon({
    getOptions,
    options,
  });

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
    visible,
    clearValue,
    selectOption,
    ...rest,
  };
};

export default useSelect;
