fetch("/api/orders")
  .then(res => res.json())
  .then(data => {
    document.getElementById("orders").innerHTML =
      data.map(o =>
        `<div>
          ${o.name} - ${o.gasBrand}
          <a href="order-details.html?lat=${o.latitude}&lng=${o.longitude}">
            Navigate
          </a>
        </div>`
      ).join("");
  });
