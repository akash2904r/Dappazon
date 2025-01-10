import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import Rating from './Rating';
import close from '../assets/close.svg';
import { deliveryDate, orderDate, parseETH } from '../utils';

const Product = ({ item, provider, account, dappazon, togglePop }) => {
  const [order, setOrder] = useState(null);
  const [hasBought, setHasBought] = useState(false);

  const fetchDetails = async () => {
    const events = await dappazon.queryFilter("Buy");
    const orders = events.filter((event) => 
      event.args.buyer === account && event.args.itemId.toString() === item.id.toString()
    );

    if (orders.length === 0) return;

    const order = await dappazon.orders(account, orders[0].args.orderId);
    setOrder(order);
  }

  const buyHandler = async () => {
    const signer = await provider.getSigner();

    let transaction = dappazon.connect(signer).buy(item.id, { value: item.cost });
    await transaction.wait();

    setHasBought(true);
  }

  useEffect(() => {
    fetchDetails();
  }, [hasBought])

  return (
    <div className="product">
      <div className="product__details">
        <div className="product__image">
          <img src={item.image} alt={item.name} />
        </div>

        <div className="product__overview">
          <h1>{item.name}</h1>
          <Rating value={item.rating} />
          <hr />
          <p>{item.address}</p>
          <h2>{parseETH(item.cost)} ETH</h2>
          <hr />
          <h2>Overview</h2>
          <p>{item.description}</p>
        </div>

        <div className="product__order">
          <h1>{parseETH(item.cost)} ETH</h1>
          <p>
            FREE delivery <br />
            <strong>
              {deliveryDate(Date.now())}
            </strong>
          </p>

          {item.stock > 0 ? <p>In Stock.</p> : <p>Out of Stock.</p>}

          <button 
            className="product__buy" 
            onClick={buyHandler}
          >Buy Now</button>

          <p><small>Ships from</small> Dappazon</p>
          <p><small>Sold by</small> Dappazon</p>

          {order && (
            <div className="product__bought">
              Item bought on <br />
              <strong>
                {orderDate(order.time.toString())}
              </strong>
            </div>
          )}
        </div>

        <button
          className="product__close"
          onClick={togglePop}
        >
          <img src={close} alt="Close" />
        </button>
      </div>
    </div>
  );
}

export default Product;