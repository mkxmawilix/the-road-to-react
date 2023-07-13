import './App.css';
import PropTypes from "prop-types";

const App = () => {

  const welcome = {
    greeting: 'Hey',
    title: 'React',
    name: 'Mkxm'
  };


  return (
    <div>
      <h1>{welcome.greeting} {welcome.title}</h1>
      <p>My name is {welcome.name}</p>

      <Search />

      <TableGames />
    </div>
  );
};

const TableGames = () => {
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
      available: false,
    },
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
        <List gamesList={games}/>
      </table>
    </div>
  );
};

const List = (props) => {
  return (
    <tbody>
      {props.gamesList.map((item) => {
        return (
          <tr key={item.objectID}>
            <td>{item.name}</td>
            <td>{item.price}</td>
            <td>{item.category}</td>
            <td>{item.available ? 'Yes' : 'No'}</td>
          </tr>
        );
      })}
    </tbody>
  );
};

const Search = () => {
  const handleChange = (event) => {
    console.log(event);
    console.log(event.target.value);
  };
  
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange}/>
    </div>
  );
};

List.propTypes = {
  gamesList: PropTypes.arrayOf(PropTypes.object),
};

export default App;
