import React from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: "Product 1",
    gltfPath: "/models/model.gltf",
  },
  {
    id: 2,
    name: "Product 2",
    gltfPath: "/models/indoor_plant/scene.gltf",
  },
  {
    id: 3,
    name: "Product 3",
    gltfPath: "/models/product3/scene.gltf",
  },
];

const ProductList = () => {
  return (
    <div>
      <h1>Product List</h1>
      <div>
        {products.map((product) => (
          <div key={product.id}>
            <Link to={`/xr?gltfPath=${product.gltfPath}`}>
              <button>View in AR</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
