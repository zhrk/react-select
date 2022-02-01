import { useRef } from 'react';
import { SiblingElement } from './types';

const useSelectAccessibility = () => {
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
    ref,
    handleOptionKeyDown,
    handleInputKeyDown,
  };
};

export default useSelectAccessibility;
