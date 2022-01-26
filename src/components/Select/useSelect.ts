import { useState, useEffect } from 'react';
import { Options, Option, Value } from './types';

interface Config {
  options: Options;
  onChange?: (value: Value) => void;
}

const Select = (config: Config) => {
  const { options, onChange } = config;

  const [value, setValue] = useState<Value>(null);

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value, onChange]);

  return {
    options,
    selectOption: (option: Option) => setValue(option),
  };
};

export default Select;
