// filepath: /Users/alexaskaridis/Downloads/spring-p2p-marketplace/demo/marketplace-ui/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <div className="jumbotron">
        <h1 className="display-4">Welcome to P2P Marketplace</h1>
        <p className="lead">Buy and sell items directly with other users</p>
        <hr className="my-4" />
        <p>Browse available items or list your own items for sale.</p>
        <Link to="/items" className="btn btn-primary btn-lg">Browse Items</Link>
      </div>
      
      <div className="row mt-5">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Buy Items</h5>
              <p className="card-text">Find great deals on products from other users.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Sell Items</h5>
              <p className="card-text">List your unused items for sale.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Connect</h5>
              <p className="card-text">Message buyers and sellers directly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;