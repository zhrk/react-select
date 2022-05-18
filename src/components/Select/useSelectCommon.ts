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

  const ref = useRef<HTMLDivElement>(null);

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

  const { x, y, strategy, context, reference, floating } = useFloating({
    open: visible,
    onOpenChange: setVisible,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({ mainAxis: OPTIONS_OFFSET }),
      autoPlacement({ allowedPlacements: ['bottom', 'top'] }),
    ],
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const selectedIndex = config.selectedIndex ? config.selectedIndex(options) : null;

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
      if (selectedIndex === index) {
        item?.scrollIntoView({ block: 'center' });
      }
    });
  }, [selectedIndex]);

  const handleScroll = () => {
    if (ref.current) {
      const curr = ref.current.scrollTop + ref.current.clientHeight;
      const height = ref.current.scrollHeight;

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
    optionsProps: {
      ref, // скорее всего перезаписано
      /* role: 'listbox', */
      tabIndex: -1,
      onScroll: handleScroll,
      ...getFloatingProps({
        ref: floating,
        style: { position: strategy, left: x ?? '', top: y ?? '' },
      }),
    },
    getOptionProps: ({ index, onClick }: { index: number; onClick?: () => void }) =>
      getItemProps({
        /* role: 'option', */
        ref: (node: HTMLButtonElement | null) => {
          listRef.current[index] = node;
        },
        onClick,
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
