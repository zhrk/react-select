import { matchSorter } from 'match-sorter';
import { useState, useEffect } from 'react';
import { Options, Option } from './types';
import useSelectAccessibility from './useSelectAccessibility';

interface Config {
  options: Options;
  onChange?: (value: Options) => void;
}

const useMultiSelect = (config: Config) => {
  const { options, onChange } = config;

  const [values, setValue] = useState<Options>([]);

  const [search, setSearch] = useState('');

  const [visible, setVisible] = useState(false);

  const { ref, handleOptionKeyDown, handleInputKeyDown } = useSelectAccessibility();

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

    if (search) setSearch('');
  };

  const clearValue = () => {
    if (search) {
      setSearch('');
    } else {
      setValue([]);
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

export default useMultiSelect;
