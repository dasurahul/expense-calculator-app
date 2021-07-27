import React, { useState, useRef, useEffect } from "react";
import db from "./firebase";
import Spinner from "react-bootstrap/Spinner";
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
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState(items);
  const [loading, setLoading] = useState(false);
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
    db.collection("expenses")
      .add(data)
      .then((docRef) => fetchData())
      .catch((error) => console.log(error));
  };
  const selectHandler = (event) => {
    if (event.target.value === "Selected Year") {
      setFilteredItems(items);
      return;
    }
    const selectedItems = items.filter(
      (item) =>
        event.target.value === new Date(item.date).getFullYear().toString()
    );
    setFilteredItems(selectedItems);
  };
  useEffect(() => {
    temp.current.value = items;
    setFilteredItems(temp.current.value);
  }, [items]);
  const fetchData = () => {
    setLoading(true);
    db.collection("expenses")
      .get()
      .then((res) => {
        let db_data = [];
        res._delegate._snapshot.docChanges.forEach((item) => {
          let idata = item.doc.data.value.mapValue.fields;

          db_data.push({
            name: idata.name.stringValue,
            date: idata.date.timestampValue,
            price: idata.price.stringValue,
          });
        });
        db_data.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        setItems(db_data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <nav className="navbar navbar-light bg-light" style={{ padding: "20px" }}>
        <span className="navbar-brand mb-0 h1">Expense App</span>
      </nav>
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
      {!loading && filteredItems.length === 0 && (
        <div>
          <p className="text-center mt-3 mb-3">No items found</p>
        </div>
      )}
      <div>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "30px 0",
            }}
          >
            {" "}
            <Spinner animation="border" />
          </div>
        ) : (
          <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            {filteredItems && filteredItems.length > 0 && (
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
                    <tr key={item.name}>
                      <td>{item.name}</td>
                      <td>{item.price} Rs</td>
                      <td>
                        <span style={{ marginRight: "10px" }}>
                          {new Date(item.date).getDate()}
                        </span>
                        <span style={{ marginRight: "10px" }}>
                          {months[new Date(item.date).getMonth()]}
                        </span>
                        <span>{new Date(item.date).getFullYear()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
