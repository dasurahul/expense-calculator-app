import React, { useState, useRef, useEffect } from "react";
import { firestore } from "./firebase";
const data = [
  {
    id: 1,
    name: "Book",
    price: "400",
    date: new Date("December 14, 2021"),
  },
  {
    id: 2,
    name: "TV",
    price: "40000",
    date: new Date("December 10, 2020"),
  },
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const App = () => {
  const [items, setItems] = useState(data);
  const [filteredItems, setFilteredItems] = useState(items);
  const name = useRef();
  const price = useRef();
  const date = useRef();
  const temp = useRef(items);
  const submitHandler = (event) => {
    event.preventDefault();
    const data = {
      name: name.current.value,
      price: price.current.value,
      date: new Date(date.current.value),
    };
    setItems((items) => [...items, data]);
    firestore
      .collection("expense")
      .doc()
      .set(data)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  const selectHandler = (event) => {
    if (event.target.value === "Selected Year") {
      setFilteredItems(items);
      return;
    }
    const selectedItems = items.filter(
      (item) => event.target.value === item.date.getFullYear().toString()
    );
    setFilteredItems(selectedItems);
  };
  useEffect(() => {
    temp.current.value = items;
    setFilteredItems(temp.current.value);
  }, [items]);
  return (
    <div>
      <h1>Expense App</h1>
      <form
        style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
        onSubmit={submitHandler}
      >
        <div className="row g-3 mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Expense Item Name"
              ref={name}
            />
          </div>
          <div className="col">
            <input type="date" className="form-control" ref={date} />
          </div>
        </div>
        <input
          type="number"
          placeholder="Price"
          className="form-control mb-3"
          ref={price}
        />
        <button type="submit" className="btn">
          Add
        </button>
      </form>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <select className="form-select" onChange={selectHandler}>
          <option value="Selected Year">Select Year</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
        </select>
      </div>
      {filteredItems.length === 0 && (
        <div>
          <p className="text-center mt-3 mb-3">No items found</p>
        </div>
      )}
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <table className="table mt-3 mb-3">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.date}>
                <td>{item.name}</td>
                <td>{item.price} Rs</td>
                <td style={{ display: "flex", gap: "10px" }}>
                  <div>{item.date.getDate()}</div>
                  <div>{months[item.date.getMonth()]}</div>
                  <div>{item.date.getFullYear()}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
