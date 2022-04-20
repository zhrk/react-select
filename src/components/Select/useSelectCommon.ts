import { useState, useEffect, useRef } from 'react';
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
} from '@floating-ui/react-dom-interactions';
import { Options, GetOptions } from './types';

const OPTIONS_OFFSET = 4;
const OPTIONS_GAP = 4;

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

  const { x, y, refs, strategy, context, reference, floating, update } = useFloating({
    open: visible,
    onOpenChange: setVisible,
    middleware: [
      offset({ mainAxis: OPTIONS_OFFSET }),
      autoPlacement({ allowedPlacements: ['bottom', 'top'] }),
    ],
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const listRef = useRef<Array<HTMLButtonElement | null>>([]);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context, { toggle: false }),
    useFocus(context, { keyboardOnly: true }),
    useDismiss(context),
    useListNavigation(context, { activeIndex, listRef, onNavigate: setActiveIndex }),
  ]);

  useEffect(() => {
    const floatingElement = refs.floating.current;

    if (visible && floatingElement && activeIndex !== null) {
      const listItem = listRef.current[activeIndex];
      const floatingHeight = floatingElement.offsetHeight;

      if (listItem) {
        const { offsetTop, offsetHeight } = listItem;

        const listItemOffsetTop = offsetTop + offsetHeight;

        if (listItemOffsetTop > floatingHeight + floatingElement.scrollTop) {
          floatingElement.scrollTop = listItemOffsetTop - floatingHeight + OPTIONS_GAP;
        } else if (offsetTop < floatingElement.scrollTop) {
          floatingElement.scrollTop = offsetTop - OPTIONS_GAP;
        }
      }
    }
  }, [visible, activeIndex, refs.floating]);

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
    getOptionProps: ({ index }: { index: number }) => ({
      role: 'option',
      ref: (node: HTMLButtonElement | null) => {
        listRef.current[index] = node;
      },
    }),
    inputProps: {
      type: 'text',
      value: search,
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
