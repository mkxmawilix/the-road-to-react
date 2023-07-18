import './App.css';
import React from 'react';
import PropTypes from "prop-types";


const useObjectStorageState = (key, initialState) => {
  const [valuesObject, setvaluesObject] = React.useState({ ...initialState });

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(valuesObject));
  }, [valuesObject, key]);

  return [valuesObject, setvaluesObject];
};


const App = () => {

  const welcome = {
    greeting: 'Hey',
    title: 'React',
    name: 'Mkxm'
  };

  const searchTermsStorage = JSON.parse(localStorage.getItem('searchTermsObject')) || { name: '', category: '', price: '' };
  const [searchTerms, setSearchTerm] = useObjectStorageState('searchTermsObject', { ...searchTermsStorage });

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
      <h1>{welcome.greeting} {welcome.title}</h1>
      <p>My name is {welcome.name}</p>

      <Search onSearch={handleSearch} inputSearchValues={searchTerms}>Search:</Search>

      <TableGames searchName={searchTerms.name} searchCategory={searchTerms.category} searchPrice={searchTerms.price} />
    </div>
  );
};

const TableGames = ({ searchName, searchCategory, searchPrice }) => {
  const games = [
    {
      objectID: 1,
      name: 'Half-Life',
      price: 19.99,
      category: 'FPS',
      available: true,
    },
    {
      objectID: 2,
      name: 'Pubg',
      price: 59.99,
      category: 'FPS',
      available: true,
    },
    {
      objectID: 3,
      name: 'Payday 3',
      price: 79.99,
      category: 'FPS',
      available: false,
    },
    {
      objectID: 4,
      name: 'Ashes of Creation',
      price: 89.99,
      category: 'MMORPG',
      available: false
    }
  ];

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
        })} />
      </table>
    </div>
  );
};

const List = ({ gamesList }) => (
  <tbody>
    {gamesList.map((item, index) => {
      return (<ListItem key={index} item={item} />);
    })}
  </tbody>
);


const ListItem = ({ item }) => (
  <tr>
    <td>{item.name}</td>
    <td>{item.price}</td>
    <td>{item.category}</td>
    <td>{item.available ? 'Yes' : 'No'}</td>
  </tr>
);


const InputWithLabel = ({ id, type = "text", onChange, value, isFocused, children }) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children} </label><input ref={inputRef} id={id} type={type} onChange={onChange} value={value} autoFocus={isFocused} />
    </>
  );
};

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

TableGames.propTypes = {
  searchName: PropTypes.string,
  searchCategory: PropTypes.string,
  searchPrice: PropTypes.string,
};
List.propTypes = {
  gamesList: PropTypes.arrayOf(PropTypes.object),
};
ListItem.propTypes = {
  item: PropTypes.object,
};
InputWithLabel.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  children: PropTypes.node,
  isFocused: PropTypes.bool,
};
Search.propTypes = {
  onSearch: PropTypes.func,
  inputValue: PropTypes.string,
  inputSearchValues: PropTypes.object,
  children: PropTypes.node,
};

export default App;
