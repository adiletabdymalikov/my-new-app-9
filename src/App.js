import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Tip } from './pages/Tip';
import { Amazon } from './pages/Amazon';
import { Walmart } from './pages/Walmart';
import { Orders } from './pages/Orders';
import { Coupons } from './pages/Coupons';
import { Users } from './pages/Users';
import { Comments } from './pages/Comments';
const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`btn mx-1 px-3 ${isActive ? 'btn-primary shadow-sm' : 'btn-outline-secondary border-0'}`}
      style={{ borderRadius: '10px', fontWeight: 500 }}
    >
      {children}
    </Link>
  );
};
function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3 mb-4">
        <div className="container d-flex flex-wrap justify-content-center gap-2">
          <NavLink to="/">Shopi</NavLink>
          <NavLink to="/amazon">Amazon</NavLink>
          <NavLink to="/walmart">Walmart</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          <NavLink to="/coupons">Coupons</NavLink>
        
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/comments">Comments</NavLink>
        </div>
      </nav>
      <main className="container pb-5">
        <Routes>
          <Route path="/" element={<Tip />} />
          <Route path="/amazon" element={<Amazon />} />
          <Route path="/walmart" element={<Walmart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/coupons" element={<Coupons />} />
          
          <Route path="/users" element={<Users />} />
          <Route path="/comments" element={<Comments />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;