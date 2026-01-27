document.getElementById("gasSize").addEventListener("change", async e => {
  const res = await fetch(`/api/gas/${e.target.value}`);
  const data = await res.json();

  document.getElementById("gasList").innerHTML = data.map(g =>
    `<div>
      <img src="${g.image}">
      <h4>${g.brand}</h4>
      <p>KES ${g.price}</p>
    </div>`
  ).join("");
});
