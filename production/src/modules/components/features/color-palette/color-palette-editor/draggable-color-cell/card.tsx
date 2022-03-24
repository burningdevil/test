import { ContextMenu } from '@mstr/rc';
import classNames from 'classnames';
import * as React from 'react';
import { CSSProperties, FC, memo } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { localizedStrings } from '../../../../../../../src/modules/components/HomeScreenConfigConstant';
import { toHex } from '../../color-palette.util';
import { ItemTypes } from './item-type';

const style: CSSProperties = {
    height: '18px',
    width: '18px',
    border: '1px solid #fff',
    margin: '2.5px 2.5px 2.5px 2.5px',
    cursor: 'move',
};

export interface CardProps {
    id: string;
    text: string;
    canDelete: boolean;
    selected: boolean;
    moveCard: (id: string, to: number) => void;
    findCard: (id: string) => { index: number };
    onRemoveFavorite: () => {};
    onClick: Function;
    handleKeyDownEvent: () => {};
}

interface Item {
    id: string;
    originalIndex: number;
}

export const Card: FC<CardProps> = memo(function Card({
    id,
    text,
    canDelete,
    moveCard,
    findCard,
    onRemoveFavorite,
    onClick,
    handleKeyDownEvent,
    selected,
}) {
    const originalIndex = findCard(id).index;
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: ItemTypes.CARD,
            item: { id, originalIndex },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
            end: (item, monitor) => {
                const { id: droppedId, originalIndex } = item;
                const didDrop = monitor.didDrop();
                if (!didDrop) {
                    moveCard(droppedId, originalIndex);
                }
            },
        }),
        [id, originalIndex, moveCard]
    );

    const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.CARD,
            hover({ id: draggedId }: Item) {
                if (draggedId !== id) {
                    const { index: overIndex } = findCard(id);
                    moveCard(draggedId, overIndex);
                }
            },
        }),
        [findCard, moveCard]
    );
    const getCell = (
        c: any,
        canDelete: boolean,
        opacity: number,
        index?: number
    ) => {
        const colorString = toHex(c);
        const classVal = classNames(
            'color-cell',
            { 'no-fill': colorString === 'transparent' },
            { selected: selected }, // eslint-disable-line quote-props
            { 'white-cell': colorString === '#ffffff' } // White cell needs to have a gray border
        );
        const cell = (
            <button
                ref={(node) => drag(drop(node))}
                type="submit"
                className={classVal}
                key={c}
                style={{ ...style, backgroundColor: toHex(c) }}
                onClick={() => onClick(c)}
                onKeyDown={handleKeyDownEvent}
                aria-label={toHex(c)}
                tabIndex={-1}
            />
        );
        return canDelete ? (
            <ContextMenu
                onItemClick={onRemoveFavorite}
                items={[
                    {
                        title: localizedStrings.DELETE,
                        itemIndex: c,
                    },
                ]}
            >
                {cell}
            </ContextMenu>
        ) : (
            cell
        );
    };
    const opacity = isDragging ? 0 : 1;
    return getCell(id, canDelete, opacity);
});
