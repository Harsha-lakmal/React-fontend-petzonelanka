import PropTypes from 'prop-types';
import CategoryType from './CategoryType';

const ProductType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  category: CategoryType.isRequired  // Assuming CategoryType is also defined with PropTypes
});

export default ProductType;