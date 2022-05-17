import styles from './styles.module.scss';
import { Options, OnChange, GetOptions, Creating } from './types';
import useSelect from './useSelect';

interface Props {
  options?: Options;
  creating?: Creating;
  onChange?: OnChange;
  getOptions?: GetOptions;
}

const Select = (props: Props) => {
  const { creating, ...config } = props;

  const {
    value,
    options,
    visible,
    selectOption,
    createOption,
    clearValue,
    inputProps,
    getOptionProps,
    optionsProps,
    isLoading,
  } = useSelect(config);

  return (
    <div className={styles.container}>
      <div className={styles.input}>
        <input {...inputProps} />
        <button type="button" onClick={clearValue} className={styles.clearValue}>
          ✖
        </button>
      </div>
      {visible && (
        <div className={styles.options} {...optionsProps}>
          {options.map((option, index) => {
            const selected = option.value === value?.value;

            return (
              <button
                key={option.value}
                type="button"
                className={styles.option}
                {...getOptionProps({ index, onClick: () => selectOption(option) })}
              >
                {option.label}
                {selected && <span>✔</span>}
              </button>
            );
          })}
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

export default Select;
