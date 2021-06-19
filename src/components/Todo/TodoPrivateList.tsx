import React, { Fragment, useState } from "react";
import { gql, useQuery } from '@apollo/client';
import TodoItem from "./TodoItem";
import TodoFilters from "./TodoFilters";

export const GET_MY_TODOS = gql`
  query getMyTodos {
    todos(where: {is_public: {_eq: false}}, order_by: {created_at: desc}) {
      id
      title
      is_completed
    }
  }
`;

type Todo = {
  id: number,
  title: string,
  is_completed: boolean
};

const TodoPrivateList = () => {

  const [filter, setFilter] = useState<string>("all");
  const { data, loading, error } = useQuery(GET_MY_TODOS);

  const filterResults = (filter: string): void => {
    setFilter(filter);
  };

  const clearCompleted = () => {
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error || !data) {
    return <div>Oops.. something went wrong...</div>;
  }
  
  let filteredTodos = data.todos;
  if (filter === "active") {
    filteredTodos = data.todos.filter((todo: Todo) => todo.is_completed !== true);
  } else if (filter === "completed") {
    filteredTodos = data.todos.filter((todo: Todo) => todo.is_completed === true);
  }

  const todoList = filteredTodos.map((todo: Todo, index: number) => (
    <TodoItem
      key={'item'+index}
      index={index}
      todo={todo}
    />
  ));

  return (
    <Fragment>
      <div className="todoListWrapper">
        <ul>
          { todoList }
        </ul>
      </div>

      <TodoFilters
        todos={filteredTodos}
        currentFilter={filter}
        filterResultsFn={filterResults}
        clearCompletedFn={clearCompleted}
      />
    </Fragment>
  );
}

export default TodoPrivateList;
