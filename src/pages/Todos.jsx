import '../App.css';
import React from 'react';
import PropTypes from "prop-types";
import { v4 as uuidv4 } from 'uuid';
import {
    Table,
    Header,
    HeaderRow,
    HeaderCell,
    Body,
    Row,
    Cell,
} from '@table-library/react-table-library/table';
import {
    useSort,
    HeaderCellSort
} from '@table-library/react-table-library/sort';


const initialTodos = [
    { id: uuidv4(), task: 'Apprendre React', complete: false },
    { id: uuidv4(), task: 'Apprendre Redux', complete: false },
    { id: uuidv4(), task: 'Apprendre React Router', complete: false },
    { id: uuidv4(), task: 'Apprendre React Context', complete: false },
    { id: uuidv4(), task: 'Apprendre React Hooks', complete: false },
];


const todoReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [...state, { id: uuidv4(), task: action.payload.name, complete: false }];
        case 'DO_TODO':
            return state.map(todo => {
                if (todo.id === action.payload.id) {
                    return { ...todo, complete: true };
                } else {
                    return todo;
                }
            });
        case 'UNDO_TODO':
            return state.map(todo => {
                if (todo.id === action.payload.id) {
                    return { ...todo, complete: false };
                } else {
                    return todo;
                }
            });
        case 'DELETE_TODO':
            return state.filter(todo => todo.id !==action.payload.id);
        default:
            return state;
    }
};

const filterReducer = (state, action) => {
    switch (action.type) {
        case 'SHOW_ALL':
            return 'ALL';
        case 'SHOW_COMPLETE':
            return 'COMPLETE';
        case 'SHOW_INCOMPLETE':
            return 'INCOMPLETE';
        default:
            throw new Error();
    }
};


const Todos = () => {

    const [todos, dispatchTodos] = React.useReducer(
        todoReducer,
        initialTodos
    );
    const [filter, dispatchFilter] = React.useReducer(filterReducer, 'ALL');
    const [task, setTask] = React.useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (event.target.task.value !== '') {
            dispatchTodos({ type: 'ADD_TODO', payload: { name: event.target.task.value } });
        }
        setTask('');
    };

    const handleChangeInput = (event) => {
        setTask(event.target.value);
    };

    const handleChangeCheckbox = (item) => {
        dispatchTodos({
            type: item.complete ? 'UNDO_TODO' : 'DO_TODO',
            payload: item,
        })
    };

    const handleRemoveItem = (item) => {
        dispatchTodos({ type: 'DELETE_TODO', payload: item });
    };

    const handleShowAll = () => {
        dispatchFilter({ type: 'SHOW_ALL' });
    };

    const handleShowComplete = () => {
        dispatchFilter({ type: 'SHOW_COMPLETE' });
    };

    const handleShowIncomplete = () => {
        dispatchFilter({ type: 'SHOW_INCOMPLETE' });
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'ALL') {
            return true;
        }

        if (filter === 'COMPLETE' && todo.complete) {
            return true;
        }

        if (filter === 'INCOMPLETE' && !todo.complete) {
            return true;
        }

        return false;
    });

    return (
        <div>
            <h1>Todos</h1>

            <div style={{display: "flex"}}>
                <FormAddTask onSubmit={handleSubmit} task={task} handleChangeInput={handleChangeInput} />
                <FilterTodos handleShowAll={handleShowAll} handleShowComplete={handleShowComplete} handleShowIncomplete={handleShowIncomplete} />
            </div>
            <ListTodos data={filteredTodos} handleChangeCheckbox={handleChangeCheckbox} onRemoveItem={handleRemoveItem} />

        </div>
    );

};

const ListTodos = ({ data, handleChangeCheckbox, onRemoveItem }) => {
    const tableData = { 'nodes': data };
    const sort = useSort(
        tableData, {
        onChange: null,
        state: {
            sortKey: 'NAME',
            reverse: false,
        },
    }, {
        sortFns: {
            NAME: (array) =>
                array.sort((a, b) => a.task.localeCompare(b.task)),
            COMPLETE: (array) =>
                array.sort((a, b) => a.complete - b.complete),
        },
    });

    return (
        <Table data={tableData} sort={sort}  className="list-table todo">
            {(tableList) => (
                <>
                    <Header>
                        <HeaderRow>
                            <HeaderCellSort sortKey="NAME">Task</HeaderCellSort>
                            <HeaderCellSort sortKey="COMPLETE">Complete</HeaderCellSort>
                            <HeaderCell></HeaderCell>
                        </HeaderRow>
                    </Header>
                    <Body>
                        {tableList.map((item) => (
                            <Row key={item.id}>
                                <Cell>{item.task}</Cell>
                                <Cell><input type="checkbox" checked={item.complete} onChange={() => handleChangeCheckbox(item)} /></Cell>
                                <Cell><button className="button button_small" onClick={() => onRemoveItem(item)}>Remove</button></Cell>
                            </Row>
                        ))}
                    </Body>
                </>
            )}
        </Table>
    );
};

const FormAddTask = ({ onSubmit, task, handleChangeInput }) => {
    return (
        <div>
            <form onSubmit={onSubmit} style={{ display: "flex" }}>
                <input type="text" id="task" name="task" value={task} onChange={handleChangeInput} />
                <button className="button button_large" type="submit">Add</button>
            </form>
        </div>
    );
};

const FilterTodos = ({ handleShowAll, handleShowComplete, handleShowIncomplete }) => {
    return (
        <div style={{ marginLeft: "55%", display: "flex" }}>
            <div>
                <button className="button button_large" type="button" onClick={handleShowAll}>
                    Show All
                </button>
                <button className="button button_large" type="button" onClick={handleShowComplete}>
                    Show Complete
                </button>
                <button className="button button_large" type="button" onClick={handleShowIncomplete}>
                    Show Incomplete
                </button>
            </div>
        </div>
    );
};

// PropTypes validation
ListTodos.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    handleChangeCheckbox: PropTypes.func,
    onRemoveItem: PropTypes.func,
};
FormAddTask.propTypes = {
    onSubmit: PropTypes.func,
    task: PropTypes.string,
    handleChangeInput: PropTypes.func,
};
FilterTodos.propTypes = {
    handleShowAll: PropTypes.func,
    handleShowComplete: PropTypes.func,
    handleShowIncomplete: PropTypes.func,
};


export default Todos;