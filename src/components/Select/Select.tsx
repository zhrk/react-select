import { useState, useEffect } from 'react';
import styles from './styles.module.scss';

type Option = { value: string; label: string };
type Options = Option[];

interface Props {
  options: Options;
  onChange?: (value: Option | null) => void;
}

const Select = (props: Props) => {
  const { options, onChange } = props;

  const [value, setValue] = useState<Option | null>(null);

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value, onChange]);

  return (
    <div className={styles.container}>
      <input type="text" />
      {options.map((option) => (
        <button key={option.value} type="button" onClick={() => setValue(option)}>
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default Select;
