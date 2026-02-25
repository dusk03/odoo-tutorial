import { Component, useState, useRef, onMounted } from "@odoo/owl";
import { useAutofocus } from "../utils";

// TodoItem component
export class TodoItem extends Component {
  static template = "awesome_owl.TodoItem";

  static props = {
    todo: {
      type: Object,
      shape: {
        id: Number,
        description: String,
        isCompleted: Boolean,
      },
    },
    toggleState: Function,
    removeTodo: Function,
  };
}

// TodoList component
export class TodoList extends Component {
  static template = "awesome_owl.TodoList";
  static components = { TodoItem };

  setup() {
    this.todos = useState([]);
    this.nextId = 1; // Counter for unique IDs

  }

  addTodo(ev) {
    // Check if Enter key was pressed
    if (ev.keyCode === 13) {
      const input = ev.target;
      const description = input.value.trim();

      // Don't add empty todos
      if (description === "") {
        return;
      }

      // Create new todo
      this.todos.push({
        id: this.nextId++,
        description: description,
        isCompleted: false,
      });

      // Clear the input
      input.value = "";
    }
  }
  toggleTodo(todoId){
    const todo = this.todos.find(t => t.id == todoId);
    if(todo){
      todo.isCompleted = !todo.isCompleted
    }
  }

  removeTodo(todoId) {
    // Find the index of the todo to delete
    const index = this.todos.findIndex(todo => todo.id === todoId);
    if (index >= 0) {
      // Remove the element at index from the array
      this.todos.splice(index, 1);
    }
  }

}
