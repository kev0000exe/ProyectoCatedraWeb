// Componente Header
function Header({ itemCount }) {
  return (
    <header className="container">
      <h1>Shopping Cart</h1>
      <ul className="breadcrumb">
        <li>Home</li>
        <li>Shopping Cart</li>
      </ul>
      <span className="count">{itemCount} items in the bag</span>
    </header>
  );
}

// Componente ProductList
function ProductList({ products, onChangeProductQuantity, onRemoveProduct }) {
  return (
    <section className="container">
      <ul className="products">
        {products.map((product, index) => (
          <li className="row" key={index}>
            <div className="col left">
              <div className="thumbnail">
                <a href="#">
                  <img src={product.image} alt={product.name} />
                </a>
              </div>
              <div className="detail">
                <div className="name">
                  <a href="#">{product.name}</a>
                </div>
                <div className="description">{product.description}</div>
                <div className="price">{formatCurrency(product.price)}</div>
              </div>
            </div>

            <div className="col right">
              <div className="quantity">
                <input
                  type="text"
                  className="quantity"
                  step="1"
                  value={product.quantity}
                  onChange={(event) => onChangeProductQuantity(index, event)}
                />
              </div>

              <div className="remove">
                <svg
                  onClick={() => onRemoveProduct(index)}
                  version="1.1"
                  className="close"
                  x="0px"
                  y="0px"
                  viewBox="0 0 60 60"
                >
                  <polygon points="38.936,23.561 36.814,21.439 30.562,27.691 24.311,21.439 22.189,23.561 28.441,29.812 22.189,36.064 24.311,38.186 30.562,31.934 36.814,38.186 38.936,36.064 32.684,29.812" />
                </svg>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Componente Summary
function Summary({ subTotal, discount, tax, onEnterPromoCode, checkPromoCode }) {
  const total = subTotal - discount + tax;

  return (
    <section className="container">
      <div className="promotion">
        <label htmlFor="promo-code">Have A Promo Code?</label>
        <input type="text" onChange={onEnterPromoCode} />
        <button type="button" onClick={checkPromoCode}>Apply</button>
      </div>

      <div className="summary">
        <ul>
          <li>Subtotal <span>{formatCurrency(subTotal)}</span></li>
          {discount > 0 && <li>Discount <span>{formatCurrency(discount)}</span></li>}
          <li>Tax <span>{formatCurrency(tax)}</span></li>
          <li className="total">Total <span>{formatCurrency(total)}</span></li>
        </ul>
      </div>

      <div className="checkout">
        <button type="button">Check Out</button>
      </div>
    </section>
  );
}

const PRODUCTS = [
  {
    image: "../Carta/imagenes/ChatGPT Image 9 abr 2025, 08_28_21 p.m..png",
    name: "Yavis Milk Shake",
    description: "Una deliciosa bebida cremosa con el equilibrio perfecto de dulzura y frescura. Ideal para acompañar tus comidas o disfrutar como un antojo refrescante. ¡Un clásico que nunca pasa de moda!",
    price: 5.99,
    quantity: 2
  },
  {
    image: "../Carta/imagenes/Imagen de WhatsApp 2025-04-03 a las 08.47.58_0c96243d.jpg",
    name: "Wulf`s Double Milk Shake",
    description: "Una experiencia doblemente deliciosa con una mezcla rica y cremosa que deleitará tu paladar. Perfecto para los amantes de los batidos que buscan un sabor intenso y refrescante. ¡Un placer que no puedes dejar pasar!",
    price: 9.99,
    quantity: 1
  }
];

const PROMOTIONS = [
  { code: "SUMMER", discount: "50%" },
  { code: "AUTUMN", discount: "40%" },
  { code: "WINTER", discount: "30%" }
];

const TAX = 5;

// Componente principal
function Page() {
  const [products, setProducts] = React.useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [...PRODUCTS];
  });

  const [promoCode, setPromoCode] = React.useState("");
  const [discountPercent, setDiscountPercent] = React.useState(0);

  const itemCount = products.reduce((sum, p) => sum + +p.quantity, 0);
  const subTotal = products.reduce((sum, p) => sum + p.price * +p.quantity, 0);
  const discount = (subTotal * discountPercent) / 100;

  const onChangeProductQuantity = (index, event) => {
    const value = event.target.value;
    const valueInt = parseInt(value);
    const updatedProducts = [...products];

    if (value === "") {
      updatedProducts[index].quantity = "";
    } else if (valueInt > 0 && valueInt < 100) {
      updatedProducts[index].quantity = valueInt;
    }

    setProducts(updatedProducts);
    localStorage.setItem("cart", JSON.stringify(updatedProducts));
  };

  const onRemoveProduct = (index) => {
    const filtered = products.filter((_, i) => i !== index);
    setProducts(filtered);
    localStorage.setItem("cart", JSON.stringify(filtered));
  };

  const onEnterPromoCode = (event) => {
    setPromoCode(event.target.value);
  };

  const checkPromoCode = () => {
    const promo = PROMOTIONS.find(p => p.code === promoCode);
    if (promo) {
      setDiscountPercent(parseFloat(promo.discount.replace("%", "")));
    } else {
      alert("Sorry, the Promotional code you entered is not valid!");
    }
  };

  return (
    <div>
      <Header itemCount={itemCount} />
      {products.length > 0 ? (
        <>
          <ProductList
            products={products}
            onChangeProductQuantity={onChangeProductQuantity}
            onRemoveProduct={onRemoveProduct}
          />
          <Summary
            subTotal={subTotal}
            discount={discount}
            tax={TAX}
            onEnterPromoCode={onEnterPromoCode}
            checkPromoCode={checkPromoCode}
          />
        </>
      ) : (
        <div className="empty-product">
          <h3>There are no products in your cart.</h3>
          <button onClick={() => {
            localStorage.removeItem("cart");
            window.location.href = "../Carta/Carta.html";
          }}>
            Ir al catálogo
          </button>
        </div>
      )}
    </div>
  );
}

// Crear raíz y renderizar en React 18
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Page />);

// Utilidad para mostrar moneda
function formatCurrency(value) {
  return Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
}
