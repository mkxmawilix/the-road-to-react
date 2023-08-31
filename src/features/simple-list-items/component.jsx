import "../../styles/App.css";
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
        name: "Simple item 1",
    },
    {
        id: uuidv4(),
        name: "Simple item 1",
    },
    {
        id: uuidv4(),
        name: "Simple item 1",
    },
]

const SimpleListItems = () => {
    const [name, setName] = React.useState('');
    const [list, setList] = React.useState(initialItems);

    const handleChangeInput = (event) => {
        setName(event.target.value);
    };

    const handleRemoveItem = (item) => {
        setList(list.filter((i) => i.id !== item.id));
    };

    const handleAddItem = () => {
        if (name === '') {
            return;
        }
        const newItem = {
            id: uuidv4(),
            name: name,
        };
        setList([...list, newItem]);
        setName('');
    };

    return (
        <StyledContainer>
            <StyledHeadlinePrimary>Simple List Items</StyledHeadlinePrimary>

            <div>
                <input type="text" value={name} onChange={handleChangeInput}/>
                <StyledButtonLarge onClick={handleAddItem}>Add</StyledButtonLarge>
            </div>
            <List items={list} onRemoveItem={handleRemoveItem} />
        </StyledContainer>
    );
};

const List = ({ items, onRemoveItem }) => (
    <div>
        <ul>
            {items.map((item) => (
                <Item key={item.id} item={item} onRemoveItem={onRemoveItem} />
            ))}
        </ul>
    </div>
);

const Item = ({ item, onRemoveItem }) => (
    <li>
        <span style={{ padding: "10px"}}>{item.name}</span>
        <StyledButtonSmall type="button" onClick={() => onRemoveItem(item)}>
            <Cross height="18px" width="18px" />
        </StyledButtonSmall>
    </li>
);

List.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    onRemoveItem: PropTypes.func,
};

Item.propTypes = {
    item: PropTypes.object,
    onRemoveItem: PropTypes.func,
};

export { SimpleListItems };
