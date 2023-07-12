import './App.css';

const welcome = {
  greeting: 'Hey',
  title: 'React',
  name: 'Mkxm'
};

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


function App() {
  return (
    <div>
      <h1>{welcome.greeting} {welcome.title}</h1>
      <p>My name is {welcome.name}</p>

      <Search />

      <TableGames />
    </div>
  );
}

function TableGames() {
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
        <ListGames />
      </table>
    </div>
  );
}

function ListGames() {
  return (
    <tbody>
      {games.map(function (game) {
        return (
          <tr key={game.objectID}>
            <td>{game.name}</td>
            <td>{game.price}</td>
            <td>{game.category}</td>
            <td>{game.available ? 'Yes' : 'No'}</td>
          </tr>
        );
      })}
    </tbody>
  );
}

function Search() {
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  );
}

export default App;
