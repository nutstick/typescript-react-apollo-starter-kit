import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { AddTodoMutation } from '../../apollo/todo/AddTodoMutation';
import { TodosQuery } from '../../apollo/todo/TodosQuery';
import { ToggleTodoMutation } from '../../apollo/todo/ToggleTodoMutation';
import { Todo } from './Todo';
import * as s from './TodoPage.css';

export namespace TodoPage {
  // tslint:disable-next-line:no-empty-interface
  export interface Props {}

  export interface State {
    addTodoData: string;
  }
}

@withStyles(s)
export class TodoPage extends React.Component<TodoPage.Props, TodoPage.State> {
  constructor(props) {
    super(props);
    this.state = {
      addTodoData: '',
    };
  }

  private onAddTodoChange(event) {
    this.setState({
      addTodoData: event.target.value,
    });
  }

  public render() {
    const { addTodoData } = this.state;
    const setState = this.setState.bind(this);
    const onAddTodoChange = this.onAddTodoChange.bind(this);
    const forceUpdate = this.forceUpdate.bind(this);
    return (
      <TodosQuery query={TodosQuery.query}>
        {({ loading, error, data, refetch }) => {
          if (loading) { return 'loading'; }
          const todos = error || !data ? [] : data.todos;

          return <AddTodoMutation mutation={AddTodoMutation.mutation}>
            {(addTodo) => {
              const onFormSubmit = (e) => {
                e.preventDefault();
                // Empty input text > No update
                if (addTodoData.length <= 0) {
                  return;
                }

                // Procede add todo mutation to client state
                addTodo({ variables: { text: addTodoData }});
                // Clear input data state
                setState({ addTodoData: '' });
              };
              return <ToggleTodoMutation mutation={ToggleTodoMutation.mutation}>
                {(toggleTodo) => {
                  const onToggleTodo = (id) => {
                    toggleTodo({ variables: { id }});
                    // FIXME: Any way to better update component
                    forceUpdate();
                  };
                  return <div className={s.root}>
                    <h4 className={s.head}>TODO</h4>
                    <div className={s.todoList}>
                      <form className={s.addTodo} onSubmit={onFormSubmit}>
                        <input
                          type="text"
                          value={addTodoData}
                          onChange={onAddTodoChange}
                          placeholder="What needs to be done?" />
                      </form>
                      <div className={s.todoList}>
                        {todos.map(({ _id, done, text }) => (
                          <Todo id={_id} done={done} text={text} onClick={onToggleTodo}>
                          </Todo>
                        ))}
                      </div>
                    </div>
                  </div>;
                }}
              </ToggleTodoMutation>;
            }}
          </AddTodoMutation>;
        }}
      </TodosQuery>
    );
  }
}
