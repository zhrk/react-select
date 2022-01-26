import styles from './styles.module.scss';
import { Options, Value } from './types';
import useSelect from './useSelect';

interface Props {
  options: Options;
  onChange?: (value: Value) => void;
}

const Select = (props: Props) => {
  const { ...config } = props;

  const { options, selectOption, clearValue } = useSelect(config);

  return (
    <div className={styles.container}>
      <div className={styles.input}>
        <input type="text" />
        <button type="button" onClick={clearValue}>
          x
        </button>
      </div>
      <div className={styles.options}>
        {options.map((option) => (
          <button key={option.value} type="button" onClick={() => selectOption(option)}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Select;
