import { matchSorter } from 'match-sorter';
import { useState, useEffect, useRef } from 'react';
import { Options, GetOptions } from './types';

const isButtonElement = (element: unknown): element is HTMLButtonElement => {
  if (element instanceof HTMLButtonElement) return true;

  return false;
};

const isButtonElements = (elements: unknown): elements is Array<HTMLButtonElement> => {
  if (elements instanceof HTMLCollection) {
    if (Array.from(elements).every((element) => element instanceof HTMLButtonElement)) return true;
  }

  return false;
};

interface Config {
  options?: Options;
  getOptions?: GetOptions;
}

const useSelectCommon = (config: Config) => {
  const { getOptions } = config;

  const [search, setSearch] = useState('');

  const [visible, setVisible] = useState(false);

  const [options, setOptions] = useState<Options>(config.options || []);

  const [scrollToBottomCount, setScrollToBottomCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onEffect = async () => {
      if (visible && getOptions) {
        setIsLoading(true);

        const response = await getOptions({ search, scrollToBottomCount });

        setOptions((prev) => [...prev, ...response]);
        setIsLoading(false);
      }
    };

    onEffect();
  }, [visible, search, scrollToBottomCount, getOptions, setOptions]);

  useEffect(() => {
    if (getOptions && !visible) setOptions([]);
  }, [visible, getOptions]);

  const getOptionsElements = () => {
    const element = ref.current;

    if (element && isButtonElements(element.children)) {
      const elements = Array.from(element.children);

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];
      const focusedElement = document.activeElement;

      const prevOption = focusedElement?.previousSibling;
      const nextOption = focusedElement?.nextSibling;

      if (isButtonElement(prevOption) && isButtonElement(nextOption)) {
        return { firstElement, lastElement, prevOption, nextOption };
      }

      if (isButtonElement(prevOption)) {
        return { firstElement, lastElement, prevOption };
      }

      if (isButtonElement(nextOption)) {
        return { firstElement, lastElement, nextOption };
      }
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

export default useSelectCommon;
