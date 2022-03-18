import styles from './styles.module.scss';
import { Options, OnChange, GetOptions } from './types';
import useSelect from './useSelect';

interface Props {
  options?: Options;
  onChange?: OnChange;
  getOptions?: GetOptions;
}

const Select = (props: Props) => {
  const { ...config } = props;

  const {
    options,
    visible,
    selectOption,
    clearValue,
    inputProps,
    optionProps,
    optionsProps,
    isLoading,
  } = useSelect(config);

  return (
    <div className={styles.container}>
      <div className={styles.input}>
        <input {...inputProps} />
        <button type="button" onClick={clearValue} className={styles.clearValue}>
          &#10005;
        </button>
      </div>
      {visible && (
        <div className={styles.options} {...optionsProps}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => selectOption(option)}
              className={styles.option}
              {...optionProps}
            >
              {option.label}
            </button>
          ))}
          {isLoading && 'Loading...'}
        </div>
      )}
    </div>
  );
};

export default Select;
