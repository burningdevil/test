import * as React from 'react';
import { FC, memo, useCallback, useState } from 'react';
import { useDrop } from 'react-dnd';
import { Card } from './card';
import update from 'immutability-helper';
import { ItemTypes } from './item-type';
import { useEffect } from 'react';
import { useImperativeHandle } from 'react';

const style = {
  // width: 400,
  display: 'grid',
  gap: '1px 0',
  gridTemplateColumns: '12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5%',
};

export interface ContainerState {
  cards: any[];
}

export const Container: React.FC<any> = memo(function Container(props: any) {
  const {
    colors,
    onAddFavorite,
    onRemoveFavorite,
    onClick,
    handleKeyDownEvent,
    saveColorList,
  } = props;

  const [cards, setCards] = useState([]);
  useEffect(() => {
    if (!colors) return;
    let temp = colors.map((v: any) => {
      return { id: v, text: 'xxx' };
    });
    setCards(temp);
  }, [colors]);
  const findCard = useCallback(
    (id: string) => {
      const card = cards.filter((c) => `${c.id}` === id)[0];
      return {
        card,
        index: cards.indexOf(card),
      };
    },
    [cards]
  );

  const moveCard = useCallback(
    (id: string, atIndex: number) => {
      const { card, index } = findCard(id);
      const newCards = update(cards, {
        $splice: [
          [index, 1],
          [atIndex, 0, card],
        ],
      });
      setCards(newCards);
      saveColorList(newCards.map((v) => v.id));
    },
    [findCard, cards, setCards]
  );

  const [, drop] = useDrop(() => ({ accept: ItemTypes.CARD }));
  return (
    <div ref={drop} style={style}>
      {cards.map((card, index) => (
        <Card
          key={card.id}
          id={`${card.id}`}
          text={card.text}
          canDelete={cards?.length > 1}
          moveCard={moveCard}
          findCard={findCard}
          onClick={onClick}
          onRemoveFavorite={onRemoveFavorite}
          handleKeyDownEvent={handleKeyDownEvent}
        />
      ))}
      {cards.length < 16 && (
        <button
          className={`add-button`}
          onClick={() => {
            onAddFavorite();
          }}
        ></button>
      )}
    </div>
  );
});
