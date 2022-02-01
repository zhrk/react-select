import { matchSorter } from 'match-sorter';
import { useState, useEffect, useRef } from 'react';
import { Options, Option, SiblingElement } from './types';

interface Config {
  options: Options;
  onChange?: (value: Options) => void;
}

const useMultiSelect = (config: Config) => {
  const { options, onChange } = config;

  const [values, setValue] = useState<Options>([]);

  const [search, setSearch] = useState('');

  const [visible, setVisible] = useState(false);

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

  const ref = useRef<HTMLDivElement>(null);

  const getOptionsElements = () => {
    const element = ref.current;

    if (element) {
      const elements = Array.from(element.children) as Array<HTMLButtonElement>;

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];
      const focusedElement = document.activeElement;

      const prevOption = focusedElement?.previousSibling as SiblingElement;
      const nextOption = focusedElement?.nextSibling as SiblingElement;

      return {
        firstElement,
        lastElement,
        prevOption,
        nextOption,
      };
    }

    return {};
  };

  const handleOptionKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { firstElement, lastElement, prevOption, nextOption } = getOptionsElements();

    if (event.key === 'ArrowUp') prevOption?.focus();
    if (event.key === 'ArrowDown') nextOption?.focus();
    if (event.key === 'Home') firstElement?.focus();
    if (event.key === 'End') lastElement?.focus();
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { firstElement } = getOptionsElements();

    if (event.key === 'ArrowDown') {
      firstElement?.focus();
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
