import { matchSorter } from 'match-sorter';
import { useState, useEffect } from 'react';
import { Options, GetOptions } from './types';
import useSelectAccessibility from './useSelectAccessibility';

interface Config {
  options?: Options;
  getOptions?: GetOptions;
}

const useSelectOptions = (config: Config) => {
  const { getOptions } = config;

  const [search, setSearch] = useState('');

  const [visible, setVisible] = useState(false);

  const [options, setOptions] = useState<Options>(config.options || []);

  const { ref, handleOptionKeyDown, handleInputKeyDown } = useSelectAccessibility();

  const [scrollToBottomCount, setScrollToBottomCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (getOptions && visible) {
      setIsLoading(true);

      getOptions({ search, scrollToBottomCount }).then((response) => {
        setOptions((prev) => [...prev, ...response]);
        setIsLoading(false);
      });
    }
  }, [visible, search, scrollToBottomCount, getOptions, setOptions]);

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
    options: getOptions ? options : matchSorter(options, search, { keys: ['label'] }),
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
    inputProps: {
      type: 'text',
      value: search,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value),
      onFocus: () => setVisible(true),
      onKeyDown: handleInputKeyDown,
    },
    visible,
    isLoading,
    clearSearch: () => setSearch(''),
    hideOptions: () => setVisible(false),
  };
};

export default useSelectOptions;
