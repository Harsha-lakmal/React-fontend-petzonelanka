import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext({
    isAuthenticated: false,
    jwtToken: null,
    loading: true,
    usertype: null,
    login: () => {},
    logout: () => {}
});

export function AuthProvider({children}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [jwtToken, setJwtToken] = useState(null);
    const [usertype, setUsertype] = useState(null);
    const [loading, setLoading] = useState(true);

    function login(dto) {
        setIsAuthenticated(true);
        setJwtToken(dto.jwtToken);
        setUsertype(dto.usertype);

        if(dto.jwtToken != null) {
            localStorage.setItem("token", dto.jwtToken);
            console.log("token is saved");
            
        }
        if(dto.usertype != null) {
            localStorage.setItem("user", dto.usertype);
        }
    }

    function logout() {
        setIsAuthenticated(false);
        setJwtToken(null);
        setUsertype(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    } 

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if(token) {
            setIsAuthenticated(true);
            setJwtToken(token);
            setUsertype(user);
            setLoading(false);
        } else {
            setLoading(false);
        }
        
    },[])

    return (
        <AuthContext.Provider value={{ isAuthenticated, jwtToken, loading, usertype, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}