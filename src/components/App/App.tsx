import { useState } from 'react';
import Select from '../Select';
import MultiSelect from '../Select/MultiSelect';
import { Value, Options } from '../Select/types';
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

const SelectExample = () => {
  const [fruit, setFruit] = useState<Value>(null);

  return (
    <div className={styles.selectContainer}>
      <div className={styles.select}>
        {fruit && <div className={styles.value}>{`Selected fruit: ${fruit.label}`}</div>}
        <Select options={options} onChange={(value) => setFruit(value)} />
      </div>
    </div>
  );
};

const MultiSelectExample = () => {
  const [fruits, setFruits] = useState<Options>([]);

  const selectedFruits = fruits.map((fruit) => fruit.label).join(', ');

  return (
    <div className={styles.selectContainer}>
      <div className={styles.select}>
        {selectedFruits && (
          <div className={styles.value}>{`Selected fruits: ${selectedFruits}`}</div>
        )}
        <MultiSelect options={options} onChange={(value) => setFruits(value)} />
      </div>
    </div>
  );
};

const App = () => (
  <div className={styles.container}>
    <SelectExample />
    <MultiSelectExample />
  </div>
);

export default App;
