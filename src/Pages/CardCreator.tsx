import React, { useEffect, useState } from "react";
import Card from "../Components/Card";
import { useSelector } from "react-redux";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { Link } from "react-router-dom";

export interface ICard {
  [key: string]: string;
}

export default () => {
  const database = getDatabase();

  const [blackCardState, setBlackCardState] = useState<string>("");
  const [whiteCardState, setwhiteCardState] = useState<string>("");
  const [cards, setCards] = useState<{ black: ICard; white: ICard }>({
    black: {},
    white: {},
  });

  const addCard = (type: "black" | "white") => {
    const cardsListRef = ref(database, `cards/${type}`);
    const newCardRef = push(cardsListRef);
    set(newCardRef, type === "black" ? blackCardState : whiteCardState);
    setBlackCardState("");
    setwhiteCardState("");
  };

  useEffect(() => {
    const cardsRef = ref(database, "cards");
    onValue(cardsRef, (snapshot) => {
      if (snapshot.exists()) {
        setCards(snapshot.val());
      } else {
        console.log("No data available");
      }
    });
  }, []);

  const handleDelete = (type: "black" | "white", index: number) => {
    const cardKey = Object.keys(cards[type])[index];
    const cardsListRef = ref(database, `cards/${type}/${cardKey}`);
    remove(cardsListRef);
  };

  return (
    <div>
      <h1 className="offset-md-4">
        Create Your Cards Here!
        <span className="offset-6">
          <Link to="/">Home</Link>
        </span>
      </h1>
      <div className="row offset-md-4">
        <div className="col-6 col-xl-5">
          <Card
            color="black"
            text={blackCardState}
            onChange={(e) => setBlackCardState(e.target?.value)}
            editable
          />
          <button
            style={{ minWidth: 300, width: "14vw", margin: 16 }}
            onClick={() => addCard("black")}
          >
            add card
          </button>
        </div>
        <div className="col col-xl-5">
          <Card
            color="white"
            text={whiteCardState}
            onChange={(e) => setwhiteCardState(e.target?.value)}
            editable
          />
          <button
            style={{ minWidth: 300, width: "14vw", margin: 16 }}
            onClick={() => addCard("white")}
          >
            add card
          </button>
        </div>
      </div>
      <div className="row offset-1 col-11">
        {Object.entries(cards.black).map((card, index) => (
          <Card
            color="black"
            key={card[0]}
            text={card[1]}
            deleteBtn
            handleDelete={() => handleDelete("black", index)}
          />
        ))}
        {Object.entries(cards.white).map((card, index) => (
          <Card
            color="white"
            key={card[0]}
            text={card[1]}
            deleteBtn
            handleDelete={() => handleDelete("white", index)}
          />
        ))}
      </div>
    </div>
  );
};
