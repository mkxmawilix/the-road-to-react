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


const useObjectStorageState = (key, initialState) => {
    const [valuesObject, setvaluesObject] = React.useState({ ...initialState });

    React.useEffect(() => {
        localStorage.setItem(key, JSON.stringify(valuesObject));
    }, [valuesObject, key]);

    return [valuesObject, setvaluesObject];
};

// Reducer for games list
const gamesReducer = (state, action) => {
    switch (action.type) {
        case 'GAMES_FETCH_INIT':
            return { ...state, isLoading: true, isError: false };
        case 'GAMES_FETCH_SUCCESS':
            return { ...state, data: action.payload, isLoading: false, isError: false };
        case 'GAMES_FETCH_FAILURE':
            return { ...state, isLoading: false, isError: true };
        case 'REMOVE_GAME':
            return { ...state, data: state.data.filter((game) => game.objectID !== action.payload.objectID) };
        case 'SET_GAMES':
            return { ...state, data: action.payload };
        default:
            throw new Error();
    }
};



// Main component
const Games = () => {

    // Initialize default games list
    const initialGames = [
        {
            objectID: uuidv4(),
            name: 'Half-Life',
            price: 19.99,
            category: 'FPS',
            available: true,
        },
        {
            objectID: uuidv4(),
            name: 'Pubg',
            price: 59.99,
            category: 'FPS',
            available: true,
        },
        {
            objectID: uuidv4(),
            name: 'Payday 3',
            price: 79.99,
            category: 'FPS',
            available: false,
        },
        {
            objectID: uuidv4(),
            name: 'Ashes of Creation',
            price: 89.99,
            category: 'MMORPG',
            available: false
        }
    ];

    // Fake async API call to get games list
    const getAsyncGames = () =>
        new Promise((resolve) =>
            setTimeout(() => resolve({ data: { games: initialGames } }), 2000)
        );

    // Define state for games list, set initial state to empty array. Games list will be fetched from API.
    const [games, dispatchGames] = React.useReducer(
        gamesReducer,
        { data: [], isLoading: false, isError: false }
    );

    // Load games list from API on component mount
    React.useEffect(() => {
        // setIsLoading(true);
        dispatchGames({ type: 'GAMES_FETCH_INIT' });

        getAsyncGames().then(result => {
            dispatchGames({ type: 'GAMES_FETCH_SUCCESS', payload: result.data.games });
        })
            .catch(() => dispatchGames({ type: 'GAMES_FETCH_FAILURE' }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Removes item from games list, set new games list (should be called on remove button click)
    const handleRemoveItem = (item) => {
        dispatchGames({ type: 'REMOVE_GAME', payload: item });
    };

    // Define refs for add game inputs
    const addGameInputName = React.useRef('');
    const addGameInputPrice = React.useRef('');
    const addGameInputCategory = React.useRef('');
    const addGameInputAvailable = React.useRef(false);

    // Handle add game button click
    const handleClickAddGame = () => {
        // Prevent empty inputs
        if (addGameInputName.current.value === '' || addGameInputPrice.current.value === '' || addGameInputCategory.current.value === '') {
            return;
        }
        // Add new game to games list
        dispatchGames({
            type: 'SET_GAMES', payload: [...games.data, {
                objectID: uuidv4(),
                name: addGameInputName.current.value,
                price: addGameInputPrice.current.value,
                category: addGameInputCategory.current.value,
                available: addGameInputAvailable.current.checked
            }]
        });
        // Clear add game inputs
        addGameInputName.current.value = '';
        addGameInputPrice.current.value = '';
        addGameInputCategory.current.value = '';
        addGameInputAvailable.current.checked = false;
    };


    // Get search terms from local storage, if not found set default values
    const searchTermsStorage = JSON.parse(localStorage.getItem('searchTermsObject')) || { name: '', category: '', price: '' };

    // Define state for search terms, set initial state to search terms from local storage
    const [searchTerms, setSearchTerm] = useObjectStorageState('searchTermsObject', { ...searchTermsStorage });

    // Handle search input change (should be called on every input change)
    const handleSearch = (event) => {
        setSearchTerm(
            {
                ...searchTerms,
                [event.target.id === 'search-by-name' ? 'name' : event.target.id === 'search-by-category' ? 'category' : 'price']: event.target.value
            }
        );

    };

    return (
        <div>
            <h1>The road to React</h1>

            <Search onSearch={handleSearch} inputSearchValues={searchTerms}>Search:</Search>

            <TableGames searchName={searchTerms.name}
                searchCategory={searchTerms.category}
                searchPrice={searchTerms.price}
                games={games} onRemoveItem={handleRemoveItem} />

            <AddGame
                handleClick={handleClickAddGame} inputRefName={addGameInputName} inputRefPrice={addGameInputPrice} inputRefCategory={addGameInputCategory} inputRefAvailable={addGameInputAvailable} />

        </div>
    );
};

// Table component
const TableGames = ({ searchName, searchCategory, searchPrice, games, onRemoveItem }) => {
    const filteredGames = games.data.filter((game) => {
        if (searchName === '' && searchCategory === '' && searchPrice === '') {
            return game;
        } else if (searchName !== '' && game.name.toLowerCase().includes(searchName.toLowerCase())) {
            return game;
        } else if (searchCategory !== '' && game.category.toLowerCase().includes(searchCategory.toLowerCase())) {
            return game;
        } else if (searchPrice !== '' && game.price <= searchPrice) {
            return game;
        }
        return null;
    });
    const tableData = { nodes: filteredGames };
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
                array.sort((a, b) => a.name.localeCompare(b.name)),
            PRICE: (array) =>
                array.sort((a, b) => a.price - b.price),
            CATEGORY: (array) =>
                array.sort((a, b) => a.category.localeCompare(b.category)),
            AVAILABLE: (array) =>
                array.sort((a, b) => a.available - b.available),
        },
    });

    return (
        <div>
            <h2>Games list</h2>

            <Table data={tableData} sort={sort} className="list-table game">
                {(tableList) => (
                    <React.Fragment>
                        <Header>
                            <HeaderRow>
                                <HeaderCellSort sortKey="NAME">Name</HeaderCellSort>
                                <HeaderCellSort sortKey="PRICE">Price</HeaderCellSort>
                                <HeaderCellSort sortKey="CATEGORY">Category</HeaderCellSort>
                                <HeaderCellSort sortKey="AVAILABLE">Available</HeaderCellSort>
                                <HeaderCell></HeaderCell>
                            </HeaderRow>
                        </Header>
                        <Body>
                            {games.isLoading ? (
                                <Row>
                                    <Cell colSpan="4">Loading...</Cell>
                                </Row>
                            ) : games.isError ? (
                                <Row>
                                    <Cell colSpan="4">Something went wrong...</Cell>
                                </Row>
                            ) : (
                                tableList.map((item) => (
                                    <Row key={item.objectID}>
                                        <Cell>{item.name}</Cell>
                                        <Cell>{item.price}</Cell>
                                        <Cell>{item.category}</Cell>
                                        <Cell>{item.available ? 'Yes' : 'No'}</Cell>
                                        <Cell>
                                            <button onClick={() => onRemoveItem(item)}>Remove</button>
                                        </Cell>
                                    </Row>
                                ))
                            )}
                        </Body>
                    </React.Fragment>
                )}
            </Table>
        </div>
    );
};

// Input component
const InputWithLabel = ({ id, type = "text", onChange, value, isFocused, isRequired, children }) => {
    const inputRef = React.useRef();

    React.useEffect(() => {
        if (isFocused) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <>
            <label htmlFor={id}>{children} </label><input ref={inputRef} id={id} type={type} onChange={onChange} value={value} autoFocus={isFocused} required={isRequired} />
        </>
    );
};

const InputWithLabelForm = ({ id, type = "text", onChange, inputRef, value, isRequired, children }) => {
    return (
        <>
            <label htmlFor={id}>{children} </label><input ref={inputRef} id={id} type={type} onChange={onChange} value={value} required={isRequired} />
        </>
    );
};


// Search component
const Search = ({ onSearch, inputSearchValues, children }) => (
    <>
        <label id="label-search" htmlFor="search">{children}</label><br />
        <div className="search-attribute-container">
            <div className="search-attribute"><InputWithLabel id="search-by-name" onChange={onSearch} value={inputSearchValues.name} isFocused>Name</InputWithLabel></div>
            <div className="search-attribute"><InputWithLabel id="search-by-category" onChange={onSearch} value={inputSearchValues.category} >Category</InputWithLabel></div>
            <div className="search-attribute"><InputWithLabel id="search-price" onChange={onSearch} value={inputSearchValues.price} >Price</InputWithLabel></div>
        </div>
        <div>Searching for
            <ul>
                {inputSearchValues.name !== '' ? <li>name: {inputSearchValues.name}</li> : ''}
                {inputSearchValues.category !== '' ? <li>category: {inputSearchValues.category}</li> : ''}
                {inputSearchValues.price !== '' ? <li>price: {inputSearchValues.price}</li> : ''}
            </ul>
        </div>
    </>
);

const AddGame = ({ handleClick, inputRefName, inputRefPrice, inputRefCategory, inputRefAvailable }) => (
    <>
        <h2>Add game</h2>
        <form className="add-game-form">
            <div>
                <InputWithLabelForm id="add-a-game-name" inputRef={inputRefName} isRequired>Name</InputWithLabelForm>
                <InputWithLabelForm id="add-a-game-price" type="number" inputRef={inputRefPrice} isRequired>Price</InputWithLabelForm>
                <InputWithLabelForm id="add-a-game-category" inputRef={inputRefCategory} isRequired>Category</InputWithLabelForm>
                <InputWithLabelForm id="add-a-game-available" type="checkbox" inputRef={inputRefAvailable}>Available</InputWithLabelForm>
            </div>
            <button type="button" onClick={handleClick}>
                Submit form
            </button>
        </form>
    </>
);

// PropTypes
TableGames.propTypes = {
    searchName: PropTypes.string,
    searchCategory: PropTypes.string,
    searchPrice: PropTypes.string,
    games: PropTypes.object,
    onRemoveItem: PropTypes.func,
};
InputWithLabel.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
    children: PropTypes.node,
    isFocused: PropTypes.bool,
    isRequired: PropTypes.bool,
};
InputWithLabelForm.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
    inputRef: PropTypes.object,
    value: PropTypes.string,
    children: PropTypes.node,
    isRequired: PropTypes.bool,
};
Search.propTypes = {
    onSearch: PropTypes.func,
    inputValue: PropTypes.string,
    inputSearchValues: PropTypes.object,
    children: PropTypes.node,
};
AddGame.propTypes = {
    handleClick: PropTypes.func,
    inputRefName: PropTypes.object,
    inputRefPrice: PropTypes.object,
    inputRefCategory: PropTypes.object,
    inputRefAvailable: PropTypes.object,
};

export default Games;
