import axios from 'axios';
import { useState } from 'react';
import Select from '../Select';
import MultiSelect from '../Select/MultiSelect';
import { Value, Options } from '../Select/types';
import DTO from '../../types/DTO';
import styles from './styles.module.scss';

const loadUsers = async (params?: Record<string, string>) => {
  const url = 'https://jsonplaceholder.typicode.com/users';

  const response = await axios.get<DTO[]>(url, { params });

  return response;
};

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
        <Select
          getOptions={async ({ search }) => {
            const response = await loadUsers(search ? { username_like: search } : {});

            const users = response.data.map((item) => ({ value: item.id, label: item.username }));

            return users;
          }}
          options={options}
          onChange={(value) => setFruit(value)}
        />
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
