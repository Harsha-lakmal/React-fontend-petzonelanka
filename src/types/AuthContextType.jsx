import PropTypes from 'prop-types';
import AuthResponseType from "./AuthResponseType";

const AuthContextType = {
    isAuthenticated: PropTypes.bool.isRequired,
    jwtToken: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    usertype: PropTypes.string,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
};

export default AuthContextType;