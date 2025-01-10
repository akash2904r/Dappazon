import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Section from './components/Section';
import Product from './components/Product';

// ABIs
import dappazonABI from './abis/Dappazon.json';

// Config
import config from './config.json';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [dappazon, setDappazon] = useState(null);

  const [categories, setCategories] = useState({ 
    clothing: null, electronics: null, toys: null
  });

  const [item, setItem] = useState({});
  const [toggle, setToggle] = useState(false);

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();

    const dappazon = new ethers.Contract(
      config[network.chainId]["dappazon"]["address"], 
      dappazonABI, 
      provider
    );
    setDappazon(dappazon);

    const items = [];
    for(var i = 0; i < 9; i++) {
      const item = await dappazon.items(i+1);
      items.push(item);
    }

    const clothing = items.filter(item => item.category === "clothing");
    const electronics = items.filter(item => item.category === "electronics");
    const toys = items.filter(item => item.category === "toys");

    setCategories({ clothing, electronics, toys });
  }

  const togglePop = (item) => {
    setItem(item);
    setToggle(prev => !prev);
  }

  const viewProducts = categories.clothing && categories.electronics && categories.toys;

  useEffect(() => {
    loadBlockchainData();
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <h2>Dappazon Best Sellers</h2>

      {viewProducts && (
        <>
          <Section 
            title="Clothing & Jewelry" 
            items={categories.clothing}
            togglePop={togglePop}
          />
          <Section 
            title="Electronics & Gadgets" 
            items={categories.electronics}
            togglePop={togglePop}
          />
          <Section 
            title="Toys & Gaming" 
            items={categories.toys}
            togglePop={togglePop}
          />
        </>
      )}

      {toggle && (
        <Product 
          item={item} 
          provider={provider} 
          account={account} 
          dappazon={dappazon} 
          togglePop={togglePop} 
        />
      )}
    </div>
  );
}

export default App;
