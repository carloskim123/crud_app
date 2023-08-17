import React, { useState, useRef, useEffect, } from 'react';
import './App.css';

export default function App(): JSX.Element {
  const [goods, setGoods] = useState<Array<Good>>([]);
  const [good, setGood] = useState<string>('');
  const [editIndex, setEditIndex] = useState<GoodIndex>(-1);
  const formRef = useRef<any>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (good) {
      const newGood = {
        text: good,
        done: false,
        slideOut: false,
        slideIn: false,
      };
      setGoods([...goods, newGood]);
      setGood('');
    }
  };

  const handleEditSubmit = (
    e:any,
    index: GoodIndex
  ) => {
    e.preventDefault();

    const updatedGoods = [...goods];
    updatedGoods[index].text = e.target.elements.editInput.value;
    setGoods(updatedGoods);
    setEditIndex(-1);
  };


  const handleDelete = (index: GoodIndex) => {
    const updatedGoods = [...goods];
    updatedGoods[index].slideOut = true;
    setGoods(updatedGoods);
    setTimeout(() => {
      updatedGoods.splice(index, 1);
      setGoods(updatedGoods);
    }, 300);
  };

  useEffect(() => {
    const newGoodIndex = goods.length - 1;
    if (newGoodIndex >= 0) {
      const timer = setTimeout(() => {
        const updatedGoods = [...goods];
        updatedGoods[newGoodIndex].slideIn = true;
        setGoods(updatedGoods);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [goods]);

  return (
    <div className="app">
      <h1>Amazon Wishlist</h1>
      <form ref={formRef} onSubmit={handleSubmit}>
        <input
          type="text"
          value={good}
          onChange={(e) => setGood(e.target.value)}
          placeholder="Enter a new wish"
          autoCapitalize='on'
        />
        <button>Add new wish</button>
      </form>
      <ul>
        {goods.map((good, index) => (
          <li
            key={index}
            className={`slide-in ${good.slideIn ? 'active' : ''} ${
              good.slideOut ? 'inactive' : ''
            }`}
            onAnimationEnd={() => {
              const updatedGoods = [...goods];
              updatedGoods[index].slideIn = false;
              updatedGoods[index].slideOut = false;
              
              setGoods(updatedGoods);
            }}
          >
            {editIndex === index ? (
              <form onSubmit={(e) => handleEditSubmit(e, index)}>
                <input type="text" name="editInput" defaultValue={good.text} autoComplete='off'/>
                <button type="submit">Save</button>
              </form>
            ) : (
              <>
                <span className="good-text">
                  {good.text.length >= 20
                    ? good.text.slice(0, 30) + '...'
                    : good.text}
                </span>
                <div>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                  <button onClick={() => setEditIndex(index)}>Edit</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
