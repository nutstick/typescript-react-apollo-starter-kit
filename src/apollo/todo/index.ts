import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import * as AddTodoMutation from './AddTodoMutation.gql';
import * as TodosQuery from './TodosQuery.gql';
import * as ToggleTodoMutation from './ToggleTodoMutation.gql';

interface Todo {
  _id: number;
  text: string;
  done: boolean;
  __typename: string;
}

let currentId = 1;

export const state = {
  defaults: {
    todos: [],
  },
  Mutation: {
    addTodo(_, variables, { cache }: { cache: InMemoryCache }) {
      const { text } = variables;
      const { todos } = cache.readQuery<TodosQuery.Query>({ query: TodosQuery });

      const todo: Todo = {
        _id: currentId++,
        text,
        done: false,
        __typename: 'Todo',
      };

      const data = {
        todos: todos.concat([todo]),
      };

      cache.writeData({ data });

      return todo;
    },
    toggleTodo: (_, variables, { cache }: { cache: InMemoryCache }) => {
      const id = `Todo:${variables.id}`;
      const fragment = gql`
        fragment completeTodo on Todo {
          _id
          text
          done
        }
      `;
      const todo = cache.readFragment<Todo>({ fragment, id });
      const data = { ...todo, done: !todo.done };
      cache.writeData({ id, data });

      return data;
    },
  },
};
