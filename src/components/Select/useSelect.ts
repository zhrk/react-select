import { matchSorter } from 'match-sorter';
import { useState, useEffect } from 'react';
import { Options, Option, Value } from './types';
import useSelectAccessibility from './useSelectAccessibility';

interface Config {
  options: Options;
  onChange?: (value: Value) => void;
}

const useSelect = (config: Config) => {
  const { options, onChange } = config;

  const [value, setValue] = useState<Value>(null);

  const [search, setSearch] = useState('');

  const [visible, setVisible] = useState(false);

  const { ref, handleOptionKeyDown, handleInputKeyDown } = useSelectAccessibility();

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value, onChange]);

  const selectOption = (option: Option) => {
    setValue(option);
    setVisible(false);
    setSearch('');
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
    clearValue,
    selectOption,
    inputProps: {
      type: 'text',
      value: search,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value),
      onFocus: () => setVisible(true),
      onKeyDown: handleInputKeyDown,
    },
    optionsProps: {
      ref,
      role: 'listbox',
      tabIndex: -1,
      onKeyDown: handleOptionKeyDown,
    },
    optionProps: {
      role: 'option',
      'aria-selected': false,
      onFocus: (event: React.FocusEvent<HTMLButtonElement>) => {
        event.target.ariaSelected = 'true';
      },
      onBlur: (event: React.FocusEvent<HTMLButtonElement>) => {
        event.target.ariaSelected = 'false';
      },
    },
  };
};

export default useSelect;
