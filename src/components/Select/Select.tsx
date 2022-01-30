import styles from './styles.module.scss';
import { Options, Value } from './types';
import useSelect from './useSelect';

interface Props {
  options: Options;
  onChange?: (value: Value) => void;
}

const Select = (props: Props) => {
  const { ...config } = props;

  const {
    options,
    search,
    visible,
    selectOption,
    clearValue,
    onInputChange,
    onInputFocus,
    optionProps,
    optionsProps,
  } = useSelect(config);

  return (
    <div className={styles.container}>
      <div className={styles.input}>
        <input value={search} onChange={onInputChange} onFocus={onInputFocus} type="text" />
        <button type="button" onClick={clearValue}>
          x
        </button>
      </div>
      {visible && (
        <div className={styles.options} {...optionsProps}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => selectOption(option)}
              {...optionProps}
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
