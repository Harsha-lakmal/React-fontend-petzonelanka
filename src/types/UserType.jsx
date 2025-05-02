import PropTypes from 'prop-types';

const UserType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  fullname: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired
});

export default UserType;