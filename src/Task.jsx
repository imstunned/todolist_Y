const ToDo = ({ todo, toggleTask, removeTask }) => {
  return (
    <div className="item-todo">
      <button
        className={todo.complete ? 'item-text strike' : 'item-text'}
        type="button"
        onClick={() => toggleTask(todo.id)}
        aria-pressed={todo.complete}
      >
        {todo.task}
      </button>
      <button
        className="item-delete"
        type="button"
        onClick={() => removeTask(todo.id)}
        aria-label={`Удалить задачу: ${todo.task}`}
      >
        ×
      </button>
    </div>
  );
};

export default ToDo;
