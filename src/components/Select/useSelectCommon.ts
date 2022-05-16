import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { matchSorter } from 'match-sorter';
import {
  offset,
  useClick,
  useFocus,
  autoUpdate,
  useDismiss,
  useFloating,
  autoPlacement,
  useInteractions,
  useListNavigation,
  useTypeahead,
  useRole,
} from '@floating-ui/react-dom-interactions';
import { Options, GetOptions } from './types';

const OPTIONS_OFFSET = 4;

interface Config {
  options?: Options;
  getOptions?: GetOptions;
  activeIndex?: (options: Options) => number;
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

  const { x, y, refs, strategy, context, reference, floating, update } = useFloating({
    open: visible,
    onOpenChange: setVisible,
    middleware: [
      offset({ mainAxis: OPTIONS_OFFSET }),
      autoPlacement({ allowedPlacements: ['bottom', 'top'] }),
    ],
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { getReferenceProps, getFloatingProps /* getItemProps */ } = useInteractions([
    /* useRole(context, { role: 'listbox' }), */
    useClick(context, { toggle: false }),
    useFocus(context, { keyboardOnly: true }),
    useDismiss(context),
    useListNavigation(context, {
      activeIndex,
      listRef,
      onNavigate: setActiveIndex,
      selectedIndex: config.activeIndex ? config.activeIndex(options) : null,
      virtual: true,
    }),
  ]);

  useLayoutEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      if (activeIndex) {
        listRef.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
      }
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [activeIndex]);

  useEffect(() => {
    if (visible && refs.reference.current && refs.floating.current) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }

    return () => undefined;
  }, [visible, refs.reference, refs.floating, update]);

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
      onScroll: handleScroll,
      ...getFloatingProps({
        ref: floating,
        style: { position: strategy, left: x ?? '', top: y ?? '' },
      }),
    },
    getOptionProps: ({ index, selected }: { index: number; selected: boolean }) => ({
      role: 'option',
      'aria-selected': selected || index === activeIndex,
      ref: (node: HTMLButtonElement | null) => {
        listRef.current[index] = node;
      },
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
