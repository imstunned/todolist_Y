import { useState } from 'react';

const ToDoForm = ({ addTask }) => {
  const [userInput, setUserInput] = useState('');

  const handleChange = (event) => {
    setUserInput(event.currentTarget.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addTask(userInput);
    setUserInput('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        value={userInput}
        type="text"
        onChange={handleChange}
        placeholder="Введите задачу..."
        aria-label="Новая задача"
      />
      <button type="submit">Сохранить</button>
    </form>
  );
};

export default ToDoForm;
