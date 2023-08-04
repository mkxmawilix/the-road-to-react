import React from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import '../App.css'

const ENDPOINT_API = 'https://hn.algolia.com/api/v1/search?query='

const storiesReducer = (state, action) => {
    switch (action.type) {
        case 'STORIES_NO_SEARCH':
            return {
                ...state,
                isLoading: false,
                isError: false,
                isNoSearch: true,
            };
        case 'STORIES_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
                isNoSearch: false,
            };
        case 'STORIES_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                isNoSearch: false,
                data: action.payload,
            };
        case 'STORIES_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
                isNoSearch: false,
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
        'React'
    );

    const [url, setUrl] = React.useState(
        `${ENDPOINT_API}${searchTerm}`
    );

    const [stories, dispatchStories] = React.useReducer(
        storiesReducer,
        { data: [], isLoading: false, isError: false, isNoSearch: false }
    );

    const handleFetchStories = React.useCallback(async () => {

        dispatchStories({ type: 'STORIES_FETCH_INIT' });

        try {
            const result = await axios.get(url);
            dispatchStories({
                type: 'STORIES_FETCH_SUCCESS',
                payload: result.data.hits,
            });
        } catch {
            dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
        }
    }, [url]);

    React.useEffect(() => {
        handleFetchStories();
    }, [handleFetchStories]);

    const handleRemoveStory = (item) => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item,
        });
    };

    const handleSearchInput = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        setUrl(`${ENDPOINT_API}${searchTerm}`);
    }

    return (
        <div>
            <h1>My Hacker Stories</h1>

            <InputWithLabel
                id="search"
                value={searchTerm}
                isFocused
                onInputChange={handleSearchInput}
            >
                <strong>Search:</strong>
            </InputWithLabel>

            <button type="button" disabled={!searchTerm} onClick={handleSearchSubmit} > Search </button>
            <hr />

            <TableStories list={stories} onRemoveItem={handleRemoveStory} />

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
                        <th className="title">Title</th>
                        <th>URL</th>
                        <th>Author</th>
                        <th>Nbr comments</th>
                        <th>Points</th>
                        <th></th>
                    </tr>
                </thead>
                <List list={list.data} onRemoveItem={onRemoveItem} isLoading={list.isLoading} isError={list.isError} isNoSearch={list.isNoSearch}/>
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

const List = ({ list, onRemoveItem, isLoading, isError, isNoSearch }) => {
    return isNoSearch ? (<tbody><tr><td colSpan="4">Please search something...</td></tr></tbody>) :
        isError ? (<tbody><tr><td colSpan="4">Something went wrong...</td></tr></tbody>) :
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
    list: PropTypes.object,
    onRemoveItem: PropTypes.func,
};

List.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object),
    onRemoveItem: PropTypes.func,
    isLoading: PropTypes.bool,
    isError: PropTypes.bool,
    isNoSearch: PropTypes.bool,
};

ListItem.propTypes = {
    item: PropTypes.object,
    onRemoveItem: PropTypes.func,
};


export default HackerNews;