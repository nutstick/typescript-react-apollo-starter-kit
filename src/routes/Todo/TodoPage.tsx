import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { AddTodoMutation } from '../../apollo/todo/AddTodoMutation';
import { TodosQuery } from '../../apollo/todo/TodosQuery';
import { ToggleTodoMutation } from '../../apollo/todo/ToggleTodoMutation';
import * as s from './TodoPage.css';

export namespace TodoPage {
  export type Props = any;

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
                addTodo({ variables: { text: addTodoData }});
                // FIXME: Any way to better update component
                forceUpdate();
              };
              return <ToggleTodoMutation mutation={ToggleTodoMutation.mutation}>
                {(toggleTodo) => {
                  const onToggleTodo = (e, id) => {
                    e.preventDefault();
                    toggleTodo({ variables: { id }})
                      .then(() => refetch());
                  };
                  return <div className={s.root}>
                    <h4>Todos</h4>
                    <form onSubmit={onFormSubmit}>
                      <input type="text" value={addTodoData} onChange={onAddTodoChange}/>
                    </form>
                    <div className={s.todoList}>
                      {todos.map(({ id, done, text }) => (
                        <div className={s.todo} key={id}>
                          <div
                            className={cx(s.grapper, { [s.done]: done })}
                            onClick={onToggleTodo.bind(this, id)}
                          ></div>
                          <div className={cx(s.text, { [s.done]: done })}>
                            {text}
                          </div>
                        </div>
                      ))}
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
