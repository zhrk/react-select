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

  const selectProps = useSelectCommon({ getOptions, options });

  const { inputProps, hideOptions, clearSearch } = selectProps;

  const { value: inputValue } = inputProps;

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

    clearSearch();
  };

  const createOption = () => {
    setValue((prev) => [...prev, { value: inputValue, label: inputValue }]);
    hideOptions();
    clearSearch();
  };

  const clearValue = () => {
    setValue([]);
    clearSearch();
  };

  return {
    clearValue,
    selectOption,
    createOption,
    ...selectProps,
  };
};

export default useMultiSelect;
