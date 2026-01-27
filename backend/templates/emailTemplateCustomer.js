module.exports = o => `
<h2>Order Confirmed</h2>
<p>Hello ${o.name},</p>
<p>Your ${o.gasBrand} ${o.gasSize} order has been received.</p>
<p>Payment: Pay on Delivery</p>
`;
