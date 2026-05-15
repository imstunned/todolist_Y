import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import ToDoForm from './AddTask.jsx';
import ToDo from './Task.jsx';

const TASKS_STORAGE_KEY = 'tasks-list-project-web';
const weatherApiKey = '0141b3a664984fbe9cb181150261505';

function App() {
  const [rates, setRates] = useState({});
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [weatherMessage, setWeatherMessage] = useState('');
  const [todos, setTodos] = useState(() => {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);

    if (!storedTasks) {
      return [];
    }

    try {
      const parsedTasks = JSON.parse(storedTasks);

      return Array.isArray(parsedTasks) ? parsedTasks : [];
    } catch (storageError) {
      console.error('Ошибка при чтении задач из localStorage:', storageError.message);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(todos));
    } catch (storageError) {
      console.error('Ошибка при сохранении задач в localStorage:', storageError.message);
    }
  }, [todos]);

  useEffect(() => {
    let isMounted = true;

    async function fetchCurrencyData() {
      const currencyResponse = await axios.get('https://www.cbr-xml-daily.ru/daily_json.js');

      if (!currencyResponse.data?.Valute) {
        throw new Error('Нет данных о валюте.');
      }

      const USDrate = currencyResponse.data.Valute.USD.Value.toFixed(2).replace('.', ',');
      const EURrate = currencyResponse.data.Valute.EUR.Value.toFixed(2).replace('.', ',');

      if (isMounted) {
        setRates({ USDrate, EURrate });
      }
    }

    async function fetchWeatherData(latitude, longitude) {
      if (!weatherApiKey) {
        setWeatherMessage('Добавьте ключ WeatherAPI.com, чтобы показать погоду.');
        return;
      }

      const weatherResponse = await axios.get('https://api.weatherapi.com/v1/current.json', {
        params: {
          key: weatherApiKey,
          q: `${latitude},${longitude}`,
          lang: 'ru',
        },
      });

      if (!weatherResponse.data?.current) {
        throw new Error('Нет данных о погоде.');
      }

      if (isMounted) {
        setWeatherData(weatherResponse.data);
      }
    }

    async function fetchAllData() {
      try {
        await fetchCurrencyData();

        if (!navigator.geolocation) {
          setWeatherMessage('Геолокация не поддерживается вашим браузером.');
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeatherData(
              position.coords.latitude,
              position.coords.longitude,
            ).catch((weatherError) => {
              console.error(weatherError);

              if (isMounted) {
                setWeatherMessage('Не удалось загрузить погоду.');
              }
            });
          },
          () => {
            if (isMounted) {
              setWeatherMessage('Разрешите доступ к геолокации, чтобы показать погоду.');
            }
          },
        );
      } catch (requestError) {
        console.error(requestError);

        if (isMounted) {
          setError('Ошибка загрузки данных.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, []);

  const addTask = (userInput) => {
    const taskText = userInput.trim();

    if (!taskText) {
      return;
    }

    const newItem = {
      id: crypto.randomUUID(),
      task: taskText,
      complete: false,
    };

    setTodos((currentTodos) => [...currentTodos, newItem]);
  };

  const removeTask = (id) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  const handleToggle = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((task) =>
        task.id === id ? { ...task, complete: !task.complete } : task,
      ),
    );
  };

  return (
    <main className="App">
      <section className="info" aria-label="Информация о валюте и погоде">
        <div className="money">
          <h2>Курсы валют</h2>

          {loading && <p>Загрузка...</p>}

          {!loading && error && <p className="error-text">{error}</p>}

          {!loading && !error && (
            <>
              <div id="USD">Доллар США $ — {rates.USDrate} руб.</div>
              <div id="EUR">Евро € — {rates.EURrate} руб.</div>
            </>
          )}
        </div>

        <div className="weather-info">
          <h2>Погода сегодня</h2>

          {weatherData ? (
            <div className="weather-row">
              <span>🌡️ {weatherData.current.temp_c.toFixed(1)}°C</span>
              <span>༄ {weatherData.current.wind_kph} км/ч</span>
              <span>☁️ {weatherData.current.cloud}%</span>

              <img
                className="weather-icon"
                src={`https:${weatherData.current.condition.icon}`}
                alt={weatherData.current.condition.text || 'Иконка погоды'}
              />
            </div>
          ) : (
            <p>{weatherMessage || 'Погода появится после разрешения геолокации.'}</p>
          )}
        </div>
      </section>

      <section className="todo-panel" aria-label="Список задач">
        <header>
          <h1 className="list-header">Список задач: {todos.length}</h1>
        </header>

        <ToDoForm addTask={addTask} />

        <div className="todo-list">
          {todos.map((todo) => (
            <ToDo
              todo={todo}
              key={todo.id}
              toggleTask={handleToggle}
              removeTask={removeTask}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;