import { useRef } from 'react';

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

const useSelectAccessibility = () => {
  const ref = useRef<HTMLDivElement>(null);

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

  return {
    ref,
    handleOptionKeyDown,
    handleInputKeyDown,
  };
};

export default useSelectAccessibility;
