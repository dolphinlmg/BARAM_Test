import { css } from '@emotion/react';
import ItemIcon from '../ItemIcon';

interface ItemStripProps {
  items: number[];
  version: string;
  width: number;
  height: number;
  padding?: number;
  direction?: 'vertical' | 'horizontal';
}

const style = {
  horizontal: (padding: number) => css`
    margin-left: -${padding}px;
    & > * {
      display: inline-block;
      margin-left: ${padding}px;
    }
  `,
  vertical: (padding: number) => css`
    margin-top: -${padding}px;
    & > * {
      display: block;
      margin-top: ${padding}px;
    }
  `,
};

function ItemStrip({
  items,
  version,
  width,
  height,
  padding = 3,
  direction = 'horizontal',
}: ItemStripProps) {
  const nullItem = 7050;
  return (
    <div css={style[direction](padding)}>
      {items.map((e, i) => (
        <ItemIcon key={i} id={e ? e : nullItem} version={version} width={width} height={height} />
      ))}
    </div>
  );
}

export default ItemStrip;