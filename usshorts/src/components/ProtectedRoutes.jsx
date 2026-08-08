import {Navigate, Outlet} from "react-router-dom";
export const ProtectedRoute=()=>{
    const user=localStorage.getItem('user');
    if(user){
        return <Outlet />;
    }else{
        return <Navigate to="/login" replace />
    }
}