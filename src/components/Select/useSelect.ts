import { matchSorter } from 'match-sorter';
import { useState, useEffect } from 'react';
import { Options, Option, Value, OnChange, GetOptions } from './types';
import useSelectAccessibility from './useSelectAccessibility';

interface Config {
  options?: Options;
  onChange?: OnChange;
  getOptions?: GetOptions;
}

const useSelect = (config: Config) => {
  const { onChange, getOptions } = config;

  const [value, setValue] = useState<Value>(null);

  const [search, setSearch] = useState('');

  const [visible, setVisible] = useState(false);

  const { ref, handleOptionKeyDown, handleInputKeyDown } = useSelectAccessibility();

  const [options, setOptions] = useState<Options>(config.options || []);

  const [scrollToBottomCount, setScrollToBottomCount] = useState(0);

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value, onChange]);

  useEffect(() => {
    if (getOptions && visible) {
      getOptions({ search, scrollToBottomCount }).then((response) => {
        setOptions((prev) => [...prev, ...response]);
      });
    }
  }, [visible, search, scrollToBottomCount, getOptions, setOptions]);

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

export default useSelect;
