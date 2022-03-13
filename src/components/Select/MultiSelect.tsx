import styles from './styles.module.scss';
import { Options, OnMultiChange, GetOptions } from './types';
import useMultiSelect from './useMultiSelect';

interface Props {
  options?: Options;
  onChange?: OnMultiChange;
  getOptions?: GetOptions;
}

const MultiSelect = (props: Props) => {
  const { ...config } = props;

  const { options, visible, selectOption, clearValue, inputProps, optionProps, optionsProps } =
    useMultiSelect(config);

  return (
    <div className={styles.container}>
      <div className={styles.input}>
        <input {...inputProps} />
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

export default MultiSelect;
