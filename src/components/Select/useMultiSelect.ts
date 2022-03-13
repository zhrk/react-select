import { matchSorter } from 'match-sorter';
import { useState, useEffect } from 'react';
import { Options, Option, OnMultiChange, GetOptions } from './types';
import useSelectAccessibility from './useSelectAccessibility';

interface Config {
  options?: Options;
  onChange?: OnMultiChange;
  getOptions?: GetOptions;
}

const useMultiSelect = (config: Config) => {
  const { onChange, getOptions } = config;

  const [values, setValue] = useState<Options>([]);

  const [search, setSearch] = useState('');

  const [visible, setVisible] = useState(false);

  const { ref, handleOptionKeyDown, handleInputKeyDown } = useSelectAccessibility();

  const [options, setOptions] = useState<Options>(config.options || []);

  const [scrollToBottomCount, setScrollToBottomCount] = useState(0);

  useEffect(() => {
    if (onChange) {
      onChange(values);
    }
  }, [values, onChange]);

  useEffect(() => {
    if (getOptions && visible) {
      getOptions({ search, scrollToBottomCount }).then((response) => {
        setOptions((prev) => [...prev, ...response]);
      });
    }
  }, [visible, search, scrollToBottomCount, getOptions, setOptions]);

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

  const handleScroll = () => {
    if (ref.current) {
      const curr = ref.current.scrollTop + ref.current.clientHeight;
      const height = ref.current.scrollHeight;

      if (curr === height) {
        setScrollToBottomCount((prev) => prev + 1);
      }
    }
  };

  return {
    visible,
    options: getOptions ? options : matchSorter(options, search, { keys: ['label'] }),
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
      onScroll: handleScroll,
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
