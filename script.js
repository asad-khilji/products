fetch('products.json')
  .then(res => res.json())
  .then(data => {
    const catalog = document.getElementById('catalog');

    data.products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = 
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <div class="size">Size: ${product.size}</div>
        <div class="bottom">
          <span>${product.code}</span>
          <span>${product.price}</span>
        </div>
      ;

      catalog.appendChild(card);
    });
  });
