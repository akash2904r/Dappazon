import { ethers } from 'ethers';

import Rating from './Rating';
import { parseETH } from '../utils';

const Section = ({ title, items, togglePop }) => {
    return (
        <div className="cards__section">
            <h3 id={title}>
                {title}
            </h3>

            <hr />

            <div className="cards">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="card"
                        onClick={() => togglePop(item)}
                    >
                        <div className="card__image">
                            <img 
                                src={item.image} 
                                alt={item.name} 
                            />
                        </div>
                        <div className="card__info">
                            <h4>{item.name}</h4>
                            <Rating value={item.rating} />
                            <p>{parseETH(item.cost)} ETH</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Section;