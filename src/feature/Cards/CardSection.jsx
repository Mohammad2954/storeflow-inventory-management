import React, { useEffect, useState } from "react";
import { pageCards } from "../../data/pageCards";
import CardItems from "./CardItems";
import { useLocation } from "react-router";

function CardSection({ card }) {
  const { pathname } = useLocation();
  const name = pathname === "/" ? "dashboard" : pathname.split("/")[1];
  let cards = pageCards[name] || [];
  cards = card;

  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      {cards.map((item) => (
        <CardItems key={item.id} {...item} />
      ))}
    </div>
  );
}

export default CardSection;
