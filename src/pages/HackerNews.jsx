import React from 'react';
import PropTypes from "prop-types";
import '../App.css'


const initialStories = [
    {
        title: 'React',
        url: 'https://reactjs.org/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectID: 0,
    },
    {
        title: 'Redux',
        url: 'https://redux.js.org/',
        author: 'Dan Abramov, Andrew Clark',
        num_comments: 2,
        points: 5,
        objectID: 1,
    },
];

const getAsyncStories = () =>
    new Promise((resolve) =>
        setTimeout(
            () => resolve({ data: { stories: initialStories } }),
            2000
        )
    );

const storiesReducer = (state, action) => {
    switch (action.type) {
        case 'STORIES_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case 'STORIES_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload,
            };
        case 'STORIES_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        case 'REMOVE_STORY':
            return {
                ...state,
                data: state.data.filter(
                    (story) => action.payload.objectID !== story.objectID
                ),
            };
        default:
            throw new Error();
    }
};

const useStorageState = (key, initialState) => {
    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initialState
    );

    React.useEffect(() => {
        localStorage.setItem(key, value);
    }, [value, key]);

    return [value, setValue];
};

const HackerNews = () => {
    const [searchTerm, setSearchTerm] = useStorageState(
        'search',
        ''
    );

    const [stories, dispatchStories] = React.useReducer(
        storiesReducer,
        { data: [], isLoading: false, isError: false }
    );

    React.useEffect(() => {
        dispatchStories({ type: 'STORIES_FETCH_INIT' });

        getAsyncStories()
            .then((result) => {
                dispatchStories({
                    type: 'STORIES_FETCH_SUCCESS',
                    payload: result.data.stories,
                });
            })
            .catch(() =>
                dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
            );
    }, []);

    const handleRemoveStory = (item) => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item,
        });
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const searchedStories = stories.data.filter((story) =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1>My Hacker Stories</h1>

            <InputWithLabel
                id="search"
                value={searchTerm}
                isFocused
                onInputChange={handleSearch}
            >
                <strong>Search:</strong>
            </InputWithLabel>

            <hr />


            <TableStories list={searchedStories} onRemoveItem={handleRemoveStory} />

        </div>
    );
};


// Table component
const TableStories = ({ list, onRemoveItem }) => {

    return (
        <div>
            <h2>Stories list</h2>
            <table className="list-table story">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>URL</th>
                        <th>Author</th>
                        <th>Nbr comments</th>
                        <th>Points</th>
                        <th></th>
                    </tr>
                </thead>
                <List list={list} onRemoveItem={onRemoveItem} isLoading={list.isLoading} isError={list.isError} />
            </table>
        </div>
    );
};


const InputWithLabel = ({
    id,
    value,
    type = 'text',
    onInputChange,
    isFocused,
    children,
}) => {
    const inputRef = React.useRef();

    React.useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <>
            <label htmlFor={id}>{children}</label>
            &nbsp;
            <input
                ref={inputRef}
                id={id}
                type={type}
                value={value}
                onChange={onInputChange}
            />
        </>
    );
};

const List = ({ list, onRemoveItem, isLoading, isError }) => {
    return isError ? (<tbody><tr><td colSpan="4">Something went wrong...</td></tr></tbody>) :
        isLoading ? (<tbody><tr><td colSpan="4">Loading...</td></tr></tbody>) : (
            <tbody>
                {list.map((item) => {
                    return (<ListItem key={item.objectID} item={item} onRemoveItem={onRemoveItem} />);
                })}
            </tbody>
        );
};

const ListItem = ({ item, onRemoveItem }) => (
    <tr>
        <td>{item.title}</td>
        <td>{item.url}</td>
        <td>{item.author}</td>
        <td>{item.num_comments}</td>
        <td>{item.points}</td>
        <td><button onClick={() => onRemoveItem(item)}>Remove</button></td>
    </tr>
);

InputWithLabel.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    type: PropTypes.string,
    onInputChange: PropTypes.func.isRequired,
    isFocused: PropTypes.bool,
    children: PropTypes.node.isRequired,
};

TableStories.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object),
    onRemoveItem: PropTypes.func,
};

List.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object),
    onRemoveItem: PropTypes.func,
    isLoading: PropTypes.bool,
    isError: PropTypes.bool,
};

ListItem.propTypes = {
    item: PropTypes.object,
    onRemoveItem: PropTypes.func,
};


export default HackerNews;