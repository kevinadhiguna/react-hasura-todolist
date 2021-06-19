import React, { Fragment, useState } from "react";
import { gql, useQuery } from '@apollo/client';
import TodoItem from "./TodoItem";
import TodoFilters from "./TodoFilters";

import { GetMyTodosQuery, Todos } from '../../generated/graphql';

export const GET_MY_TODOS = gql`
  query getMyTodos {
    todos(where: {is_public: {_eq: false}}, order_by: {created_at: desc}) {
      id
      title
      is_completed
    }
  }
`;

const TodoPrivateList = () => {

  const [filter, setFilter] = useState<string>("all");
  const { 
    data,     // An object containing the result of your GraphQL query. This will contain our actual data from the server. In our case, it will be the todo data.
    loading,  // A boolean that indicates whether the request is in flight. If loading is true, then the request hasn't finished. Typically this information can be used to display a loading spinner.
    error     // A runtime error with graphQLErrors and networkError properties. Contains information about what went wrong with your query.
  } = useQuery<GetMyTodosQuery>(GET_MY_TODOS);

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
    filteredTodos = data.todos.filter((todo: Pick<Todos, "id" | "title" | "is_completed">) => todo.is_completed !== true);
  } else if (filter === "completed") {
    filteredTodos = data.todos.filter((todo: Pick<Todos, "id" | "title" | "is_completed">) => todo.is_completed === true);
  }

  const todoList = filteredTodos.map((todo: Pick<Todos, "id" | "title" | "is_completed">, index: number) => (
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
