import './App.css';
import React from 'react';
import PropTypes from "prop-types";


const useObjectStorageState = (key, initialState) => {
  const [valuesObject, setvaluesObject] = React.useState({...initialState});

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
  const [searchTerms, setSearchTerm] = useObjectStorageState('searchTermsObject', {...searchTermsStorage});

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

      <Search onSearch={handleSearch} inputSearchValues={searchTerms} />

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


const Search = ({ onSearch, inputSearchValues }) => (
  <div>
    <label id="label-search" htmlFor="search">Search: </label><br />
    <div className="search-attribute-container">
      <div className="search-attributes">Name <input id="search-by-name" type="text" onChange={onSearch} value={inputSearchValues.name} /></div>
      <div className="search-attributes">Category <input id="search-by-category" type="text" onChange={onSearch} value={inputSearchValues.category} /></div>
      <div className="search-attributes">Price <input id="search-price" type="text" onChange={onSearch} value={inputSearchValues.price} /></div>
    </div>
    <div>Searching for
      <ul>
        {inputSearchValues.name !== '' ? <li>name: {inputSearchValues.name}</li> : ''}
        {inputSearchValues.category !== '' ? <li>category: {inputSearchValues.category}</li> : ''}
        {inputSearchValues.price !== '' ? <li>price: {inputSearchValues.price}</li> : ''}
      </ul>
    </div>
  </div>
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
Search.propTypes = {
  onSearch: PropTypes.func,
  inputValue: PropTypes.string,
  inputSearchValues: PropTypes.object,
};

export default App;
