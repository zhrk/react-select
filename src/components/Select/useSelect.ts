import { matchSorter } from 'match-sorter';
import { useState, useEffect } from 'react';
import { Options, Option, Value } from './types';

interface Config {
  options: Options;
  onChange?: (value: Value) => void;
}

const Select = (config: Config) => {
  const { options, onChange } = config;

  const [value, setValue] = useState<Value>(null);

  const [search, setSearch] = useState('');

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value, onChange]);

  return {
    options: search ? matchSorter(options, search, { keys: ['label'] }) : options,
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value),
    clearValue: () => setValue(null),
    selectOption: (option: Option) => setValue(option),
  };
};

export default Select;
