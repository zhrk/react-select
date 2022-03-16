import { useState, useEffect } from 'react';
import { Options, Option, OnMultiChange, GetOptions } from './types';
import useSelectCommon from './useSelectCommon';

interface Config {
  options?: Options;
  onChange?: OnMultiChange;
  getOptions?: GetOptions;
}

const useMultiSelect = (config: Config) => {
  const { options, onChange, getOptions } = config;

  const [values, setValue] = useState<Options>([]);

  const { visible, hideOptions, clearSearch, ...rest } = useSelectCommon({
    getOptions,
    options,
  });

  useEffect(() => {
    if (onChange) {
      onChange(values);
    }
  }, [values, onChange]);

  const selectOption = (option: Option) => {
    const selectedValues = values.map((value) => value.value);

    if (selectedValues.includes(option.value)) {
      setValue(values.filter((value) => value.value !== option.value));
    } else {
      setValue([...values, option]);
    }

    hideOptions();
    clearSearch();
  };

  const clearValue = () => {
    setValue([]);
    clearSearch();
  };

  return {
    visible,
    clearValue,
    selectOption,
    ...rest,
  };
};

export default useMultiSelect;
