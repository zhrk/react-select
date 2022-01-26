import styles from './styles.module.scss';
import { Options, Value } from './types';
import useSelect from './useSelect';

interface Props {
  options: Options;
  onChange?: (value: Value) => void;
}

const Select = (props: Props) => {
  const { ...config } = props;

  const { options, selectOption } = useSelect(config);

  return (
    <div className={styles.container}>
      <input type="text" />
      {options.map((option) => (
        <button key={option.value} type="button" onClick={() => selectOption(option)}>
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default Select;
