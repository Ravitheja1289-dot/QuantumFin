import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import './Sidebar.css';
import { 
  BarChart2, 
  MessageSquare, 
  PieChart, 
  ChartCandlestick, 
  TrendingUp, 
  User, 
  LogOut
} from 'lucide-react';

const Sidebar = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <BarChart2 size={20} />, path: '/dashboard' },
    { id: 'chatbot', name: 'AI Assistant', icon: <MessageSquare size={20} />, path: '/chatbot' },
    { id: 'portfolio', name: 'Portfolio', icon: <PieChart size={20} />, path: '/portfolio' },
    { id: 'charts', name: 'Charts', icon: <ChartCandlestick size={20} />, path: '/charts' },
  ];

  const handleLogout = () => {
    console.log("Logging out...");
    googleLogout();
    setUser(null);
    localStorage.removeItem("isLoggedIn");
    sessionStorage.clear();
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <TrendingUp size={24} />
          <h1>Quantum Fin</h1>
        </div>
      </div>
      
      <div className="menu-items">
        {menuItems.map((item) => (
          <div 
            key={item.id}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`} 
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <div 
          className={`menu-item ${location.pathname === '/profile' ? 'active' : ''}`} 
          onClick={() => navigate('/profile')}
        >
          <User size={20} />
          <span>Profile</span>
        </div>
        <div className="menu-item logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
