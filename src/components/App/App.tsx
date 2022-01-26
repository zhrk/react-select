import { useState } from 'react';
import Select from '../Select';
import styles from './styles.module.scss';

const options = [
  {
    value: 'apple',
    label: 'Apple 🍎',
  },
  {
    value: 'banana',
    label: 'Banana 🍌',
  },
  {
    value: 'kiwi',
    label: 'Kiwi 🥝',
  },
  {
    value: 'orange',
    label: 'Orange 🍊',
  },
  {
    value: 'lemon',
    label: 'Lemon 🍋',
  },
];

const App = () => {
  const [fruit, setFruit] = useState<string | null>(null);

  const selectedFruit = options.find((option) => option.value === fruit)?.label;

  return (
    <div className={styles.container}>
      <div className={styles.select}>
        {selectedFruit && <div className={styles.fruit}>{`Selected fruit: ${selectedFruit}`}</div>}
        <Select options={options} onChange={(value) => setFruit(value?.value || null)} />
      </div>
    </div>
  );
};

export default App;
