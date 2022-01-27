import { useRef } from 'react';
import styles from './styles.module.scss';
import { Options, Value, SiblingElement } from './types';
import useSelect from './useSelect';

interface Props {
  options: Options;
  onChange?: (value: Value) => void;
}

const Select = (props: Props) => {
  const { ...config } = props;

  const ref = useRef<HTMLDivElement>(null);

  const { options, search, visible, selectOption, clearValue, onInputChange, onInputFocus } =
    useSelect(config);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (ref.current) {
      const elements = Array.from(ref.current.children) as Array<HTMLButtonElement>;

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];
      const focusedElement = document.activeElement;

      const prevOption = focusedElement?.previousSibling as SiblingElement;
      const nextOption = focusedElement?.nextSibling as SiblingElement;

      if (event.key === 'ArrowUp') prevOption?.focus();
      if (event.key === 'ArrowDown') nextOption?.focus();
      if (event.key === 'Home') firstElement?.focus();
      if (event.key === 'End') lastElement?.focus();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.input}>
        <input value={search} onChange={onInputChange} onFocus={onInputFocus} type="text" />
        <button type="button" onClick={clearValue}>
          x
        </button>
      </div>
      {visible && (
        <div
          ref={ref}
          role="listbox"
          tabIndex={-1}
          className={styles.options}
          onKeyDown={handleKeyDown}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected="false"
              onClick={() => selectOption(option)}
              onFocus={(event) => {
                event.target.ariaSelected = 'true';
              }}
              onBlur={(event) => {
                event.target.ariaSelected = 'false';
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
