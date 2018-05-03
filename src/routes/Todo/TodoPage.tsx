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
}

@withStyles(s)
export class TodoPage extends React.Component<TodoPage.Props> {
  constructor(props) {
    super(props);

    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  private onFormSubmit(inputText, addTodo) {
    event.preventDefault();
    // Empty input text > No update
    if (inputText.length <= 0) {
      return;
    }

    // Procede add todo mutation to client state
    addTodo({ variables: { text: inputText }})
      .then((p) => {
        // Clear input data state
        this.setState({ addTodoData: '' });
      });
  }

  public render() {
    let input = '';
    const onFormSubmit = this.onFormSubmit;
    const forceUpdate = this.forceUpdate.bind(this);
    return (
      <TodosQuery>
        {({ loading, error, data, refetch }) => {
          if (loading) { return 'loading'; }
          const todos = error || !data ? [] : data.todos;

          return <AddTodoMutation mutation={AddTodoMutation.mutation}>
            {(addTodo) => {
              return <ToggleTodoMutation mutation={ToggleTodoMutation.mutation}>
                {(toggleTodo) => {
                  const onToggleTodo = (id) => {
                    toggleTodo({ variables: { id }})
                      .then(() => forceUpdate());
                  };
                  return <div className={s.root}>
                    <h4 className={s.head}>TODO</h4>
                    <div className={s.todoList}>
                      <form className={s.addTodo} onSubmit={(event) => onFormSubmit(event, addTodo)}>
                        <input
                          type="text"
                          ref={(node) => {
                            console.log(node)
                            input = node.value;
                          }}
                          placeholder="What needs to be done?" />
                      </form>
                      <div className={s.todoList}>
                        {todos.map(({ _id, done, text }) => (
                          <Todo id={_id} done={done} text={text} onClick={() => onToggleTodo(_id)} key={`todo-${_id}`}>
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
