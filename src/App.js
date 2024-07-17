import './App.css';
import { useEffect, useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [transactions,setTransactions] = useState([]);
  
  useEffect(()=>{
    getTransaction().then(setTransactions)
  })

  async function getTransaction(){
    const url = process.env.REACT_APP_API_URL + "/transactions";
    const response = await fetch(url);
    return await response.json();
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    let url = process.env.REACT_APP_API_URL + "/transaction";
    const price = parseFloat(name.split(" ")[0]);
    const actualName = name.substring(name.indexOf(" ") + 1);
    console.log('Fetching from URL:', url);

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: actualName,
        description, 
        datetime,
        price
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        console.log('Transaction details:', json);
        setName(" ");
        setDate(" ");
        setDescription(" ")
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  let balance =0;
  for(const transaction of transactions){
    balance = balance + transaction.price;
  }

  return (
    <>
      <main>
        <h1>₹{balance}</h1>
        {/* {transactions.length} */}
        <form onSubmit={handleSubmit}>
          <div className="basic">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Add expense"
            />
            <input
              type="datetime-local"
              onChange={e => setDate(e.target.value)}
              value={datetime}
            />
          </div>

          <div className="description">
            <input
              type="text"
              placeholder="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <button type="submit">Add new transaction</button>
        </form>

        <div className="transactions">
      {transactions.length > 0 && transactions.map(transaction => (
        <div className="transaction" 
key={transaction.id}>
          <div className="left">
            <div className="name">{transaction.name}</div>
            <div className="description">{transaction.description}</div>
          </div>
          <div className="right">
            <div className={"price " + (transaction.price < 0 ? 'red' : 'green')}>
              {transaction.price < 0 ? `-${Math.abs(transaction.price)}` : transaction.price}
            </div>
          </div>
          <div className="datetime">{transaction.datetime}</div>
        </div>
      ))}
    </div>
      </main>
    </>
  );
}

export default App;
