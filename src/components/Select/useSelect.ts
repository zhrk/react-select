import { matchSorter } from 'match-sorter';
import { useState, useEffect, useRef } from 'react';
import { Options, Option, Value, SiblingElement } from './types';

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

export default Select;
