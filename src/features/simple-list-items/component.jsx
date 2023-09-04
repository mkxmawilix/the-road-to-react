import "../../styles/App.css";
import "./styles.css";
import React from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import {
    StyledButtonLarge,
    StyledButtonSmall,
    StyledContainer,
    StyledHeadlinePrimary,
} from "../../components/styled-components";
import { ReactComponent as Cross } from "../../icons/cross.svg";

const initialItems = [
    {
        id: uuidv4(),
        name: "Player 1",
        points: 100,
        gold: 1500,
    },
    {
        id: uuidv4(),
        name: "Player 2",
        points: 70,
        gold: 850,
    },
    {
        id: uuidv4(),
        name: "Player 3",
        points: 40,
        gold: 2400,
    },
    {
        id: uuidv4(),
        name: "Player 4",
        points: 30,
        gold: 550,
    },
];

const SimpleListItems = () => {
    const [form, setForm] = React.useState({
        name: "",
        points: 0,
        gold: 0,
    });
    const [list, setList] = React.useState(initialItems);

    const handleRemoveItem = React.useCallback(
        (item) => {
            setList(list.filter((i) => i.id !== item.id));
        },
        [list]
    );

    const inputChangeHandlerForm = (event) => {
        const { id, value } = event.target;
        setForm({ ...form, [id]: value });
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();
        handleAddItem(form);
    };

    const handleAddItem = () => {
        if (form.name === "") {
            return;
        }

        const newItem = {
            id: uuidv4(),
            name: form.name,
            points: form.points,
            gold: form.gold,
        };
        setList([...list, newItem]);
        setForm({
            name: "",
            points: 0,
            gold: 0,
        });
    };

    return (
        <StyledContainer>
            <StyledHeadlinePrimary>Simple List Items</StyledHeadlinePrimary>

            <Form
                name={form.name}
                points={form.points}
                gold={form.gold}
                onSubmitHandler={onSubmitHandler}
                inputChangeHandler={inputChangeHandlerForm}
            />
            <List items={list} onRemoveItem={handleRemoveItem} />
        </StyledContainer>
    );
};

const List = React.memo(({ items, onRemoveItem }) => (
    <div>
        <li className="item item-header">
            <span>Name</span>
            <span>Points</span>
            <span>Gold</span>
            <span>Action</span>
        </li>
        {items.map((item) => (
            <Item key={item.id} item={item} onRemoveItem={onRemoveItem} />
        ))}
    </div>
));
List.displayName = "List";

const Item = ({ item, onRemoveItem }) => (
    <li className="item">
        <span>{item.name}</span>
        <span>{item.points}</span>
        <span>{item.gold}</span>
        <span>
            <StyledButtonSmall type="button" onClick={() => onRemoveItem(item)}>
                <Cross height="18px" width="18px" />
            </StyledButtonSmall>
        </span>
    </li>
);

const Form = ({ name, points, gold, onSubmitHandler, inputChangeHandler }) => {
    return (
        <form onSubmit={onSubmitHandler}>
            <label htmlFor="name">Name:</label>
            <input id="name" type="text" value={name} onChange={(e) => inputChangeHandler(e)} />
            <label htmlFor="points">Points:</label>
            <input id="points" type="number" value={points} onChange={(e) => inputChangeHandler(e)} />
            <label htmlFor="gold">Gold:</label>
            <input id="gold" type="number" value={gold} onChange={(e) => inputChangeHandler(e)} />
            <StyledButtonLarge type="submit">Add</StyledButtonLarge>
        </form>
    );
};

List.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    onRemoveItem: PropTypes.func,
};

Item.propTypes = {
    item: PropTypes.object,
    onRemoveItem: PropTypes.func,
};

Form.propTypes = {
    name: PropTypes.string,
    points: PropTypes.number,
    gold: PropTypes.number,
    onSubmitHandler: PropTypes.func,
    inputChangeHandler: PropTypes.func,
};

export { SimpleListItems };
