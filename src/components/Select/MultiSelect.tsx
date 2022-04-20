import styles from './styles.module.scss';
import { Options, OnMultiChange, GetOptions, Creating } from './types';
import useMultiSelect from './useMultiSelect';

interface Props {
  options?: Options;
  creating?: Creating;
  onChange?: OnMultiChange;
  getOptions?: GetOptions;
}

const MultiSelect = (props: Props) => {
  const { creating, ...config } = props;

  const {
    options,
    visible,
    selectOption,
    createOption,
    clearValue,
    inputProps,
    getOptionProps,
    optionsProps,
    isLoading,
  } = useMultiSelect(config);

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
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              className={styles.option}
              onClick={() => selectOption(option)}
              {...getOptionProps({ index })}
            >
              {option.label}
            </button>
          ))}
          {isLoading && 'Loading...'}
          {creating && !options.length && (
            <button type="button" className={styles.create} onClick={() => createOption()}>
              Create
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
