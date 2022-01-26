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

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value, onChange]);

  const selectOption = (option: Option) => {
    setValue(option);

    if (search) setSearch('');
  };

  const clearValue = () => {
    if (search) {
      setSearch('');
    } else {
      setValue(null);
    }
  };

  return {
    visible,
    options: search ? matchSorter(options, search, { keys: ['label'] }) : options,
    search,
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value),
    onInputFocus: () => setVisible(true), // вынести всё что относится к инпуту в отдельный объект
    clearValue,
    selectOption,
  };
};

export default Select;
