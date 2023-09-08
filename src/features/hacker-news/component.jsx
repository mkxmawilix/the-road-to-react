import "../../styles/App.css";
import { ReactComponent as Cross} from '../../icons/cross.svg';
import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Table, Header, HeaderRow, HeaderCell, Body, Row, Cell } from "@table-library/react-table-library/table";
import { useSort, HeaderCellSort } from "@table-library/react-table-library/sort";
import {
    StyledContainer,
    StyledHeadlinePrimary,
    StyledButtonSmall,
    StyledButtonLarge,
    StyledSearchForm,
    StyledDivLineFlexNoStyle
} from "../../components/styled-components";

const API_BASE = "https://hn.algolia.com/api/v1";
const API_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";

const getSumComments = (stories) => {
    return stories.reduce((result, value) => result + value.num_comments, 0);
};

const getUrl = (searchTerm, page) =>
    `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;
const extractSearchTerm = (url) =>
    url
    // extract the string between `?` and `&` in the url (i.e https://[...]/[...]/search?query=react&sort=...)
    .substring(url.lastIndexOf("?") + 1, url.lastIndexOf("&")) // query=react
    .replace(PARAM_SEARCH, "");  // react
const getLastSearches = (urls) => 
    urls
    .reduce((result, url, index) => {
        const searchTerm = extractSearchTerm(url);
        if (index === 0) {
            return result.concat(searchTerm);
        }

        const previousSearchTerm = result[result.length - 1];
        if (searchTerm === previousSearchTerm) {
            return result;
        } else {
            return result.concat(searchTerm);
        }
    }, [])
    .slice(-6)
    .slice(0, -1)
    .map(extractSearchTerm);

const storiesReducer = (state, action) => {
    switch (action.type) {
        case "STORIES_NO_SEARCH":
            return {
                ...state,
                isLoading: false,
                isError: false,
                isNoSearch: true,
            };
        case "STORIES_FETCH_INIT":
            return {
                ...state,
                isLoading: true,
                isError: false,
                isNoSearch: false,
            };
        case "STORIES_FETCH_SUCCESS":
            return {
                ...state,
                isLoading: false,
                isError: false,
                isNoSearch: false,
                data: action.payload.page === 0 ? action.payload.list : state.data.concat(action.payload.list),
                page: action.payload.page,
            };
        case "STORIES_FETCH_FAILURE":
            return {
                ...state,
                isLoading: false,
                isError: true,
                isNoSearch: false,
            };
        case "REMOVE_STORY":
            return {
                ...state,
                data: state.data.filter((story) => action.payload.objectID !== story.objectID),
            };
        default:
            throw new Error();
    }
};

const useStorageState = (key, initialState) => {
    const isMounted = React.useRef(false);
    const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

    React.useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        } else {
            localStorage.setItem(key, value);
        }
    }, [value, key]);

    return [value, setValue];
};

const HackerNews = () => {
    const [searchTerm, setSearchTerm] = useStorageState("search", 'react');

    const [urls, setUrls] = React.useState([getUrl(searchTerm, 0)]);

    const [stories, dispatchStories] = React.useReducer(storiesReducer, {
        data: [],
        page: 0,
        isLoading: false,
        isError: false,
        isNoSearch: false,
    });

    const handleFetchStories = React.useCallback(async () => {
        dispatchStories({ type: "STORIES_FETCH_INIT" });

        try {
            const lastUrl = urls[urls.length - 1];
            const result = await axios.get(lastUrl);
            dispatchStories({
                type: "STORIES_FETCH_SUCCESS",
                payload: {
                    list: result.data.hits,
                    page: result.data.page,
                },
            });
        } catch {
            dispatchStories({ type: "STORIES_FETCH_FAILURE" });
        }
    }, [urls]);

    React.useEffect(() => {
        handleFetchStories();
    }, [handleFetchStories]);

    const handleRemoveStory = (item) => {
        dispatchStories({
            type: "REMOVE_STORY",
            payload: item,
        });
    };

    const handleSearchInput = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = (searchTerm, page) => {
        const url = getUrl(searchTerm, page);
        setUrls(urls.concat(url));
    };

    const handleSearchSubmit = (event) => {
        handleSearch(searchTerm, 0)
        event.preventDefault();
    };

    const handleLastSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
        handleSearch(searchTerm, 0)
    };

    const handleMore = () => {
        const lastUrl = urls[urls.length - 1];
        const searchTerm = extractSearchTerm(lastUrl);
        handleSearch(searchTerm, stories.page + 1);
    };

    const tableData = { nodes: stories.data };
    const sort = useSort(
        tableData,
        {
            onChange: null,
            state: {
                sortKey: "POINTS",
                reverse: true,
            },
        },
        {
            sortFns: {
                TITLE: (array) => array.sort((a, b) => a.title.localeCompare(b.title)),
                URL: (array) => array.sort((a, b) => a.price - b.price),
                AUTHOR: (array) => array.sort((a, b) => a.author.localeCompare(b.author)),
                NBR_COMMENTS: (array) => array.sort((a, b) => a.num_comments - b.num_comments),
                POINTS: (array) => array.sort((a, b) => a.points - b.points),
            },
        }
    );

    const sumComments = React.useMemo(() => getSumComments(stories.data), [stories]);
    const lastSearches  = getLastSearches(urls);

    return (
        <StyledContainer>
            <StyledHeadlinePrimary>My Hacker Stories</StyledHeadlinePrimary>

            <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit} />
            <LastSearches lastSearches={lastSearches} handleLastSearch={handleLastSearch} />
            <div>
                <p>Sum comments: {sumComments}</p>
            </div>
            <Table data={tableData} sort={sort} className="list-table story">
                {(tableList) => (
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
                            {stories.isNoSearch ? (
                                <Row>
                                    <Cell colSpan="4">No search</Cell>
                                </Row>
                            ) : stories.isError ? (
                                <Row>
                                    <Cell colSpan="4">Something went wrong...</Cell>
                                </Row>
                            ) : stories.isLoading ? (
                                <Row>
                                    <Cell colSpan="4">Loading...</Cell>
                                </Row>
                            ) : (
                                tableList.map((item) => (
                                    <Row key={item.objectID}>
                                        <Cell>{item.title}</Cell>
                                        <Cell>{item.url}</Cell>
                                        <Cell>{item.author}</Cell>
                                        <Cell>{item.num_comments}</Cell>
                                        <Cell>{item.points}</Cell>
                                        <Cell>
                                            <StyledButtonSmall
                                                type="button"
                                                onClick={() => handleRemoveStory(item)}
                                            >
                                                <Cross height="18px" width="18px" />
                                            </StyledButtonSmall>
                                        </Cell>
                                    </Row>
                                ))
                            )}
                        </Body>
                    </>
                )}
            </Table>
            <StyledButtonLarge type="button" onClick={handleMore}>
                More
            </StyledButtonLarge>
        </StyledContainer>
    );
};

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
    <StyledSearchForm onSubmit={onSearchSubmit}>
        <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={onSearchInput}>
            <strong>Search:</strong>
        </InputWithLabel>

        <StyledButtonLarge type="submit" disabled={!searchTerm}>
            {" "}
            Search{" "}
        </StyledButtonLarge>
    </StyledSearchForm>
);

const LastSearches = ({lastSearches, handleLastSearch}) => {
    return (
        <StyledDivLineFlexNoStyle>
            <p>Last searches:</p>
            {lastSearches.map((searchTerm, index) => (
                <StyledButtonLarge key={searchTerm + index} onClick={() => handleLastSearch(searchTerm)}>
                    {searchTerm}
                </StyledButtonLarge>
            ))}
        </StyledDivLineFlexNoStyle>
    );
};

const InputWithLabel = ({ id, value, type = "text", onInputChange, isFocused, children }) => {
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
            <input ref={inputRef} id={id} type={type} value={value} onChange={onInputChange} />
        </>
    );
};

SearchForm.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearchInput: PropTypes.func.isRequired,
    onSearchSubmit: PropTypes.func.isRequired,
};

LastSearches.propTypes = {
    lastSearches: PropTypes.arrayOf(PropTypes.object),
    handleLastSearch: PropTypes.func,
};

InputWithLabel.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    type: PropTypes.string,
    onInputChange: PropTypes.func.isRequired,
    isFocused: PropTypes.bool,
    children: PropTypes.node.isRequired,
};

export { HackerNews };
