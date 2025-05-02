import PropTypes from 'prop-types';

const StockDtoType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  qty: PropTypes.number.isRequired
});

export default StockDtoType;