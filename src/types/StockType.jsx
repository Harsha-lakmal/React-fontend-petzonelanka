import PropTypes from 'prop-types';
import ProductType from './ProductType';

const StockType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  item: ProductType.isRequired,  
  qoh: PropTypes.number.isRequired
});

export default StockType;