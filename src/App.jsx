import './App.css';
import React from 'react';
import PropTypes from "prop-types";
import { v4 as uuidv4 } from 'uuid';


const useObjectStorageState = (key, initialState) => {
  const [valuesObject, setvaluesObject] = React.useState({ ...initialState });

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(valuesObject));
  }, [valuesObject, key]);

  return [valuesObject, setvaluesObject];
};


const App = () => {

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
  const [games, setGames] = React.useState([]);

  // Set initial state to loading
  const [isLoading, setIsLoading] = React.useState(false);

  // Set initial state to error
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);

    getAsyncGames().then(result => {
      setGames(result.data.games);
      setIsLoading(false);
    })
      .catch(() => setIsError(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Removes item from games list, set new games list (should be called on remove button click)
  const handleRemoveItem = (item) => {
    const newGames = games.filter((game) => item.objectID !== game.objectID);
    setGames(newGames);
  };

  // Define refs for add game inputs
  const addGameInputName = React.useRef('');
  const addGameInputPrice = React.useRef('');
  const addGameInputCategory = React.useRef('');
  const addGameInputAvailable = React.useRef(false);

  // Handle add game button click
  const handleClickAddGame = () => {
    // Add new game to games list
    setGames([...games, {
      objectID: uuidv4(),
      name: addGameInputName.current.value,
      price: addGameInputPrice.current.value,
      category: addGameInputCategory.current.value,
      available: addGameInputAvailable.current.checked
    }]);
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

      <TableGames searchName={searchTerms.name} searchCategory={searchTerms.category} searchPrice={searchTerms.price} games={games} onRemoveItem={handleRemoveItem} isLoading={isLoading} isError={isError} />

      <AddGame
        handleClick={handleClickAddGame} inputRefName={addGameInputName} inputRefPrice={addGameInputPrice} inputRefCategory={addGameInputCategory} inputRefAvailable={addGameInputAvailable} />

    </div>
  );
};

// Table component
const TableGames = ({ searchName, searchCategory, searchPrice, games, onRemoveItem, isLoading, isError }) => {

  return (
    <div>
      <h2>Games list</h2>
      <table className="game-list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Available</th>
            <th></th>
          </tr>
        </thead>
        <List gamesList={games.filter((el) => {
          if (searchName === '' && searchCategory === '' && searchPrice === '') {
            return el;
          } else if (searchName !== '' && el.name.toLowerCase().includes(searchName.toLowerCase())) {
            return el;
          } else if (searchCategory !== '' && el.category.toLowerCase().includes(searchCategory.toLowerCase())) {
            return el;
          } else if (searchPrice !== '' && el.price <= searchPrice) {
            return el;
          }
          return null;
        })} onRemoveItem={onRemoveItem} isLoading={isLoading} isError={isError} />
      </table>
    </div>
  );
};

// List component
const List = ({ gamesList, onRemoveItem, isLoading, isError }) => {
  return isError ? (<tbody><tr><td colSpan="4">Something went wrong...</td></tr></tbody>) :
    isLoading ? (<tbody><tr><td colSpan="4">Loading...</td></tr></tbody>) : (
    <tbody>
      {gamesList.map((item) => {
        return (<ListItem key={item.objectID} item={item} onRemoveItem={onRemoveItem} />);
      })}
    </tbody>
  );
};

// List item component
const ListItem = ({ item, onRemoveItem }) => (
  <tr>
    <td>{item.name}</td>
    <td>{item.price}</td>
    <td>{item.category}</td>
    <td>{item.available ? 'Yes' : 'No'}</td>
    <td><button onClick={() => onRemoveItem(item)}>Remove</button></td>
  </tr>
);

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
  games: PropTypes.arrayOf(PropTypes.object),
  onRemoveItem: PropTypes.func,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
};
List.propTypes = {
  gamesList: PropTypes.arrayOf(PropTypes.object),
  onRemoveItem: PropTypes.func,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
};
ListItem.propTypes = {
  item: PropTypes.object,
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

export default App;
