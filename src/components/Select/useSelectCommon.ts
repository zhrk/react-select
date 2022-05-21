import { useState, useEffect, useRef } from 'react';
import { matchSorter } from 'match-sorter';
import {
  offset,
  useRole,
  useClick,
  useFocus,
  autoUpdate,
  useDismiss,
  useFloating,
  autoPlacement,
  useInteractions,
  useListNavigation,
} from '@floating-ui/react-dom-interactions';
import { Options, GetOptions } from './types';

const OPTIONS_OFFSET = 4;

interface Config {
  options?: Options;
  getOptions?: GetOptions;
  selectedIndex?: (options: Options) => number;
}

const useSelectCommon = (config: Config) => {
  const { getOptions } = config;

  const [search, setSearch] = useState('');

  const [visible, setVisible] = useState(false);

  const [options, setOptions] = useState<Options>(config.options || []);

  const [scrollToBottomCount, setScrollToBottomCount] = useState(0);

  const [isLoading, setIsLoading] = useState(!!getOptions);

  useEffect(() => {
    const onEffect = async () => {
      if (visible && getOptions) {
        setIsLoading(true);

        const response = await getOptions({ search, scrollToBottomCount });

        /* setOptions((prev) => [...prev, ...response]); */
        setOptions(response);
        setIsLoading(false);
      }
    };

    onEffect();
  }, [visible, search, scrollToBottomCount, getOptions, setOptions]);

  useEffect(() => {
    if (getOptions && !visible) setOptions([]);
  }, [visible, getOptions]);

  useEffect(() => {
    if (!visible) setScrollToBottomCount(0);
  }, [visible]);

  const { x, y, strategy, context, refs, reference, floating } = useFloating({
    open: visible,
    onOpenChange: setVisible,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({ mainAxis: OPTIONS_OFFSET }),
      autoPlacement({ allowedPlacements: ['bottom', 'top'] }),
    ],
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setSelectedIndex((prev) => {
      if (config.selectedIndex) return prev === null ? config.selectedIndex(options) : prev;

      return prev;
    });
  }, [config, options]);

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useRole(context, { role: 'listbox' }),
    useClick(context, { toggle: false }),
    useFocus(context, { keyboardOnly: true }),
    useDismiss(context),
    useListNavigation(context, {
      enabled: visible,
      listRef,
      virtual: true,
      focusItemOnHover: false,
      activeIndex,
      selectedIndex,
      onNavigate: setActiveIndex,
    }),
  ]);

  useEffect(() => {
    if (activeIndex !== null) {
      listRef.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  useEffect(() => {
    listRef.current.forEach((item, index) => {
      if (selectedIndex === index && scrollToBottomCount === 0) {
        item?.scrollIntoView({ block: 'center' });
      }
    });
  }, [selectedIndex, isLoading, scrollToBottomCount]);

  const handleScroll = () => {
    const floatingRef = refs.floating.current;

    if (floatingRef) {
      const curr = floatingRef.scrollTop + floatingRef.clientHeight;
      const height = floatingRef.scrollHeight;

      if (curr === height) {
        setScrollToBottomCount((prev) => prev + 1);
      }
    }
  };

  const getReturnedOptions = () => {
    if (getOptions) return options;

    if (search) return matchSorter(options, search, { keys: ['label'] });

    return options;
  };

  return {
    options: getReturnedOptions(),
    optionsProps: getFloatingProps({
      /* role: 'listbox', */
      ref: floating,
      style: { position: strategy, left: x ?? '', top: y ?? '' },
      onScroll: handleScroll,
    }),
    getOptionProps: ({ index, onClick }: { index: number; onClick?: () => void }) =>
      getItemProps({
        /* role: 'option', */
        ref: (node: HTMLButtonElement | null) => {
          listRef.current[index] = node;
        },
        onClick: () => {
          if (onClick) onClick();

          setSelectedIndex(index);
        },
        'aria-selected': index === activeIndex,
      }),
    inputProps: {
      type: 'text',
      value: search,
      /* 'aria-autocomplete': 'list', */
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value),
      ...getReferenceProps({ ref: reference }),
    },
    visible,
    isLoading,
    clearSearch: () => setSearch(''),
    hideOptions: () => setVisible(false),
  };
};

export default useSelectCommon;
