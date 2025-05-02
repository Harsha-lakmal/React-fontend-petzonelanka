import PropTypes from 'prop-types';
import ProductType from "./ProductType";

const OrderType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  orderDateTime: PropTypes.instanceOf(Date).isRequired,
  orderTotal: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(ProductType).isRequired
});

export default OrderType;