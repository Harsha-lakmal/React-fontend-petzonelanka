import PropTypes from 'prop-types';

const CategoryType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired
});

export default CategoryType;