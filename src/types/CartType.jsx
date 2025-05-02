import PropTypes from 'prop-types';

const CartType = PropTypes.shape({
  stockId: PropTypes.number.isRequired,
  itemId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  qty: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired
});

export default CartType;