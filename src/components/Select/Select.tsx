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
        <ul className={styles.options} {...optionsProps}>
          {options.map((option, index) => {
            const selected = option.value === value?.value;

            return (
              <li key={option.value} className={styles.option} {...getOptionProps({ index })}>
                <button type="button" onClick={() => selectOption(option)}>
                  {option.label}
                  {selected && <span>✔</span>}
                </button>
              </li>
            );
          })}
          {isLoading && 'Loading...'}
          {creating && !options.length && (
            <button type="button" className={styles.create} onClick={() => createOption()}>
              Create
            </button>
          )}
        </ul>
      )}
    </div>
  );
};

export default Select;
