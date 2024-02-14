import { useState, useEffect } from "react";
import uniqid from "uniqid";
import { validate } from "./helpers";
import "./App.css";

function App() {
  const [list, setList] = useState([]);

  const [todo, setTodo] = useState({
    text: "",
    completed: false,
    duration: 500, 
  });

  const [errors, setErrors] = useState({
    text: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [checked, setChecked] = useState(false);

  const [showCompleted, setShowCompleted] = useState(true);


  const handleChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;

    setTodo({
      ...todo,
      [name]: value,
    });

    const error = validate(name, value);

    setErrors({
      [name]: error,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (errors.text.length > 0 || todo.text.trim() === "") {
      alert("Something went wrong");
    } else {
      
      if (editingId !== null) {
        // Editing existing todo item
        const updatedList = list.map((item) =>
          item.id === editingId ? { ...item, ...todo } : item
        );
        setList(updatedList);
        setEditingId(null);
        setTodo({
          text: "",
          completed: false,
          duration: 500, 
        });
       
      }
      
      else {
      const newTodo = {
        ...todo,
        id: uniqid(),
      };

      setList([...list, newTodo]);
    }

      setTodo({
        text: "",
        completed: false,
        duration: 500,  
      });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setList((prevList) =>
        prevList.map((item) =>
          item.duration > 0
            ? { ...item, duration: item.duration - 1 }
            : { ...item, duration: 0 }
        )
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const expiredItems = list.filter((item) => item.duration === 0);
    
    if (expiredItems.length > 0) {
      setList((prevList) =>
        prevList.filter((item) => item.duration > 0)
      );
    }
  }, [list]);

  function toggle(id) {
    const updatedList = list.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setList(updatedList);
  }

  const handleRemove = (id) => {
    setList((prevList) => prevList.filter((item) => item.id !== id));
  };

  const handleEdit = (id) => {
    const todoToEdit = list.filter((item) => item.id === id);

      setTodo({ 
        text: todoToEdit.text,
        completed: todoToEdit.completed,
        duration:500
      });
      setEditingId(id);
  };
  



  const handleCompleteAll = () => {

    const allCompleted = list.every((item) => item.completed);
    if (allCompleted) {
      return;
    }
    const updatedList = list.map((item) => ({
      ...item,
      completed: !checked,
    }));
    setList(updatedList);
    setChecked(!checked);
  };
  

  const handleRemoveCompleted = () => {
    const updatedList = list.filter((item) => !item.completed);
    setList(updatedList);
  };

    const handleToggleShowCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  const completedCount = list.reduce(
    (count, item) => (item.completed ? count + 1 : count),0
  );

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form_into">
          <div className="input">

            <div>
            <label style={{ fontWeight: "900" }} htmlFor="todo">
              Todo
            </label>
            <input
              className="todo"
              name="text"
              value={todo.text}
              onChange={handleChange}
            /> 
            {errors.text && <p style={{ color: "red" }}>{errors.text}</p>}
            </div>

            <div>
            <button className="btn" type="submit">
              Add
            </button>
            </div>
          </div>

          <div className="elements">
          <div>
              <button className="btn_complete_all" onClick={handleCompleteAll}>
                Complete All
              </button>

              <button
                className="btn_remove_completed"
                onClick={handleRemoveCompleted}
              >
                Remove Completed
              </button>

              <button
                className="btn_toggle_completed"
                onClick={handleToggleShowCompleted}
              >
                Toggle Completed
              </button>

              <span className="completed_span">Completed: {completedCount}</span>

            </div>

            {list.map((item) => (
              (showCompleted || !item.completed) &&(
            
              <div key={item.id}>
                <input type="checkbox"
                checked={checked ? item.completed : false}
                onChange={() => toggle(item.id)} />
                <label
                  htmlFor="checkbox"
                  style={{
                    textDecoration: item.completed
                      ? "line-through"
                      : "none",
                    opacity: item.completed ? 0.7 : 1,
                  }}
                >
                  {" "}
                  {item.text} - Time Left: {item.duration} seconds
                </label>{" "}
                <button className="btn_edit" onClick={() => handleEdit(item.id)}>Edit</button>
                <button className="btn_remove" onClick={() => handleRemove(item.id)}>Remove</button>
                <br />
              </div>

              )
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;
