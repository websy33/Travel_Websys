// Product Component
function Product() {
  const amount = 500;
  const currency = "INR";
  const receiptTd = "qwsaq1";

  const paymentHandler = async (e) => {
    const response = await fetch("http://localhost:5000/order", {
      method: "POST",
      body: JSON.stringify({
        amount,
        currency,
        receipt: receiptTd,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const order = await response.json();
    console.log(order);
  };

  return (
    <div className='product'>
      <button onClick={paymentHandler}>Pay Now</button>
    </div>
 );
}