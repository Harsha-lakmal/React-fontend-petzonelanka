import PropTypes from 'prop-types';

const AuthResponseType = {
  jwtToken: PropTypes.string.isRequired,
  usertype: PropTypes.string.isRequired
};

export default AuthResponseType;