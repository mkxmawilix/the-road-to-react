import '../App.css'
import React from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
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

    const tableData = { nodes: stories.data };
    const sort = useSort(
        tableData, {
        onChange: null,
        state: {
            sortKey: 'POINTS',
            reverse: true,
        },
    }, {
        sortFns: {
            TITLE: (array) =>
                array.sort((a, b) => a.title.localeCompare(b.title)),
            URL: (array) =>
                array.sort((a, b) => a.price - b.price),
            AUTHOR: (array) =>
                array.sort((a, b) => a.author.localeCompare(b.author)),
            NBR_COMMENTS: (array) =>
                array.sort((a, b) => a.num_comments - b.num_comments),
            POINTS: (array) =>
                array.sort((a, b) => a.points - b.points),
        },
    });

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

            <Table data={tableData} sort={sort} className="list-table story">
                {
                    (tableList) => (
                        <>
                            <Header>
                                <HeaderRow>
                                    <HeaderCellSort sortKey="TITLE">Title</HeaderCellSort>
                                    <HeaderCellSort sortKey="URL">URL</HeaderCellSort>
                                    <HeaderCellSort sortKey="AUTHOR">Author</HeaderCellSort>
                                    <HeaderCellSort sortKey="NBR_COMMENTS">Nbr comments</HeaderCellSort>
                                    <HeaderCellSort sortKey="POINTS">Points</HeaderCellSort>
                                    <HeaderCell></HeaderCell>
                                </HeaderRow>
                            </Header>
                            <Body>
                                {
                                    stories.isNoSearch ? (<Row><Cell colSpan="4">No search</Cell></Row>) :
                                        stories.isError ? (<Row><Cell colSpan="4">Something went wrong...</Cell></Row>) :
                                            stories.isLoading ? (<Row><Cell colSpan="4">Loading...</Cell></Row>) : (
                                                tableList.map((item => (
                                                    <Row key={item.objectID}>
                                                        <Cell>{item.title}</Cell>
                                                        <Cell>{item.url}</Cell>
                                                        <Cell>{item.author}</Cell>
                                                        <Cell>{item.num_comments}</Cell>
                                                        <Cell>{item.points}</Cell>
                                                        <Cell>
                                                            <button type="button" onClick={() => handleRemoveStory(item)}>Remove</button>
                                                        </Cell>
                                                    </Row>
                                                )))
                                            )
                                }
                            </Body>
                        </>
                    )
                }
            </Table>
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

InputWithLabel.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    type: PropTypes.string,
    onInputChange: PropTypes.func.isRequired,
    isFocused: PropTypes.bool,
    children: PropTypes.node.isRequired,
};


export default HackerNews;