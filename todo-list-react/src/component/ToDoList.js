import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Style.css";

const TodoList = () => {
  // Define state variables
  const [tasks, setTasks] = useState([]); // Holds the list of tasks
  const [inputValue, setInputValue] = useState(""); // Holds the value of the input field
  const [filter, setFilter] = useState("all"); // Holds the current filter type
  const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded
  const [editTaskId, setEditTaskId] = useState(""); // Holds the ID of the task being edited

  // Fetch initial data when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  // Function to fetch todos from an API
  const fetchTodos = async () => {
    try {
      // asynchronous GET request to fetch todos from the API
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=4"
      );
      // Parse the response as JSON and store it in the 'todos' variable
      const todos = await response.json();
      // Update the 'tasks' state with the fetched 'todos'
      setTasks(todos);
      // Set 'isLoading' to false, indicating that data has been successfully loaded
      setIsLoading(false);
    } catch (error) {
      // If an error occurs during the fetch, log the error and set 'isLoading' to false
      console.log("Error fetching todos:", error);
      setIsLoading(false);
    }
  };

  // Function to handle input change
  const handleInputChange = (event) => {
    // Update the 'inputValue' state with the current value of the input field
    setInputValue(event.target.value);
  };

  // Function to add a new task
  const handleAddTask = async () => {
    // Check if the input value is empty or contains only whitespace
    if (inputValue.trim() === "") {
      return;
    }

    // Create a new task object with a title and initial completion state
    const newTask = {
      title: inputValue,
      completed: false,
    };

    try {
      //asynchronous POST request to add a new task to the API
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          body: JSON.stringify(newTask),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      // Parse the response as JSON to get the added task data
      const addedTask = await response.json();
      // Update the 'tasks' state by adding the new task to the previous tasks
      setTasks((prevTasks) => [addedTask, ...prevTasks]);
      // Clear the input field
      setInputValue("");
      // Show a success toast notification
      toast.success("Task added successfully");
    } catch (error) {
      // If an error occurs during task addition, log the error and show an error toast
      console.log("Error adding task:", error);
      toast.error("Error adding task");
    }
  };

  // Function to handle checkbox change for a task
  const handleTaskCheckboxChange = (taskId) => {
    // Update the 'tasks' state by toggling the completion state of the selected task
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Function to delete a task
  const handleDeleteTask = (taskId) => {
    // Remove the selected task from the 'tasks' state
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    // Show a success toast notification
    toast.success("Task deleted successfully");
  };

  // Function to edit a task
  const handleEditTask = (taskId) => {
    // Set the 'editTaskId' state with the ID of the task being edited
    setEditTaskId(taskId);
    // Find the task to edit from the 'tasks' state and set its title to the input field
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setInputValue(taskToEdit.title);
  };

  // Function to update a task
  const handleUpdateTask = async () => {
    console.log("handleUpdateTask called");
    if (inputValue.trim() === "") {
      return;
    }
    // Create an updated task object with a new title and initial completion state
    const updatedTask = {
      title: inputValue,
      completed: false,
    };

    try {
      // Make an asynchronous PUT request to update the task with the specified 'editTaskId'
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${editTaskId}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedTask),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      // Parse the response as JSON to get the updated task data
      const updatedTaskData = await response.json();
      // Update the 'tasks' state by replacing the task with the updated title
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editTaskId
            ? { ...task, title: updatedTaskData.title }
            : task
        )
      );
      // Clear the input field and reset 'editTaskId'
      setInputValue("");
      setEditTaskId(null);
      // Show a success toast notification
      toast.success("Task updated successfully");
    } catch (error) {
      // If an error occurs during task update, log the error and show an error toast
      console.log("Error updating task:", error);
      toast.error("Error updating task");
    }
  };

  // Function to mark all tasks as completed
  const handleCompleteAll = () => {
    // Update the 'tasks' state by marking all tasks as completed
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, completed: true }))
    );
  };

  // Function to clear completed tasks
  const handleClearCompleted = () => {
    // Remove all completed tasks from the 'tasks' state
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };

  // Function to handle filter change
  const handleFilterChange = (filterType) => {
    // Update the 'filter' state with the selected filter type
    setFilter(filterType);
  };

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") {
      return true;
    } else if (filter === "completed") {
      return task.completed;
    } else if (filter === "uncompleted") {
      return !task.completed;
    }
    return true;
  });

  // Display loading message while data is being fetched
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render the todo list
  return (
    <div className="container">
      <ToastContainer />
      <div className="todo-app">
        <h2>Todo List</h2>
        <hr />
        <br />
        <div className="row">
          <i className="fas fa-list-check"></i>
          {/* Input Field for Adding a New Task */}
          <input
            type="text"
            className="add-task"
            id="add"
            placeholder="Add your todo"
            autoFocus // Automatically focus on this input field
            value={inputValue} // Bind the input value to the 'inputValue' state
            onChange={handleInputChange} // Call 'handleInputChange' when the input value changes
          />
          {/* Button for Adding or Updating a Task */}
          <button
            id="btn"
            onClick={editTaskId ? handleUpdateTask : handleAddTask}
          >
            {/* If 'editTaskId' is not null, display 'Update'; otherwise, display 'Add' */}
            {editTaskId ? "Update" : "Add"}
          </button>
        </div>

        <div className="mid">
          <i className="fas fa-check-double"></i>
          {/* Paragraph Element for Marking All Tasks as Completed */}
          <p id="complete-all" onClick={handleCompleteAll}>
            Complete all tasks
          </p>
          {/* Paragraph Element for Clearing Completed Tasks */}
          <p id="clear-all" onClick={handleClearCompleted}>
            Delete comp tasks
          </p>
        </div>

        <ul id="list">
          {/* Map through 'filteredTasks' and create an 'li' element for each task */}
          {filteredTasks.map((task) => (
            <li key={task.id}>
              {/* Checkbox input for marking the task as completed */}
              <input
                type="checkbox"
                id={`task-${task.id}`}
                data-id={task.id}
                className="custom-checkbox"
                checked={task.completed}
                onChange={() => handleTaskCheckboxChange(task.id)}
              />
              {/* Label for displaying the task title */}
              <label htmlFor={`task-${task.id}`}>{task.title}</label>
              <div>
                {/* Edit icon for editing the task */}
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png"
                  className="edit"
                  alt ="img"
                  data-id={task.id}
                  onClick={() => handleEditTask(task.id)}
                />
                {/* Delete icon for deleting the task */}
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3096/3096673.png"
                  className="delete"
                  alt ="img"
                  data-id={task.id}
                  onClick={() => handleDeleteTask(task.id)}
                />
              </div>
            </li>
          ))}
        </ul>
        <hr />
        <div className="filters">
          <div className="dropdown">
            <button className="dropbtn">Filter</button>
            <div className="dropdown-content">
              {/* Filter option: All */}
              <a id="all" onClick={() => handleFilterChange("all")}>
                All
              </a>
              {/* Filter option: Uncompleted */}
              <a
                id="rem"
                onClick={() => handleFilterChange("uncompleted")}
              >
                Uncompleted
              </a>
              {/* Filter option: Completed */}
              <a
                id="com"
                onClick={() => handleFilterChange("completed")}
              >
                Completed
              </a>
            </div>
          </div>

          <div className="completed-task">
            <p>
              {/* Display the number of completed tasks */}
              Completed:{" "}
              <span id="c-count">
                {tasks.filter((task) => task.completed).length}
              </span>
            </p>
          </div>
          <div className="remaining-task">
            <p>
              <span id="total-tasks">
                {/* Display the total number of tasks */}
                Total Tasks: <span id="tasks-counter">{tasks.length}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
