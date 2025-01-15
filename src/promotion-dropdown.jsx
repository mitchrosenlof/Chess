import { getPieceIcon } from './board-utils';

const PromotionDropdown = ({ onSelect, player }) => {
  return (
    <div className="border border-black bg-teal-600 rounded">
      <div
        className="h-20 w-20 hover:cursor-pointer hover:bg-teal-100"
        onClick={() => onSelect(2)}
      >
        {getPieceIcon(2, player)}
      </div>
      <div
        className="h-20 w-20 hover:cursor-pointer hover:bg-teal-100"
        onClick={() => onSelect(3)}
      >
        {getPieceIcon(3, player)}
      </div>
      <div
        className="h-20 w-20 hover:cursor-pointer hover:bg-teal-100"
        onClick={() => onSelect(4)}
      >
        {getPieceIcon(4, player)}
      </div>
      <div
        className="h-20 w-20 hover:cursor-pointer hover:bg-teal-100"
        onClick={() => onSelect(5)}
      >
        {getPieceIcon(5, player)}
      </div>
    </div>
  );
};

export default PromotionDropdown;
