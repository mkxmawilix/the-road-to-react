import './App.css';
import React from 'react';
import PropTypes from "prop-types";

const App = () => {

  const welcome = {
    greeting: 'Hey',
    title: 'React',
    name: 'Mkxm'
  };

  const [searchTerms, setSearchTerm] = React.useState({name: '', category: '', price: ''});
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

      <TableGames filterTable={searchTerms} />
    </div>
  );
};

const TableGames = (props) => {
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

  const {name, category, price} = props.filterTable;
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
          if (name === '' && category === '' && price === '') {
            return el;
          } else if (name !== '' && el.name.toLowerCase().includes(name.toLowerCase())) {
            return el;
          } else if (category !== '' && el.category.toLowerCase().includes(category.toLowerCase())) {
            return el;
          } else if (price !== '' && el.price <= price) {
            return el;
          }
          return null;
        })} />
      </table>
    </div>
  );
};

const List = (props) => {
  const gamesData = props.gamesList;
  return (
    <tbody>
      {gamesData.map((item, index) => {
        return (<ListItem key={index} item={item} />);
      })}
    </tbody>
  );
};

const ListItem = (props) => (
  <tr>
    <td>{props.item.name}</td>
    <td>{props.item.price}</td>
    <td>{props.item.category}</td>
    <td>{props.item.available ? 'Yes' : 'No'}</td>
  </tr>
)

const Search = (props) => {
  return (
    <div>
      <label htmlFor="search">Search: </label><br />
      <div className="search-attribute-container">
        <div className="search-attributes">Name <input id="search-by-name" type="text" onChange={props.onSearch} /></div>
        <div className="search-attributes">Category <input id="search-by-category" type="text" onChange={props.onSearch} /></div>
        <div className="search-attributes">Price <input id="search-price" type="text" onChange={props.onSearch} /></div>
      </div>
      <p>Searching for <strong>{props.inputValue}</strong></p>
    </div>
  );
};

TableGames.propTypes = {
  filterTable: PropTypes.string,
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
};

export default App;
