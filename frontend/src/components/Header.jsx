import { NavLink } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <span className="header-app">打ち込みジム</span>
      <nav className="header-tabs">
        <NavLink to="/" end className="tab">
          top.ts
        </NavLink>
        <NavLink to="/typing" className="tab">
          typing.ts
        </NavLink>
        <NavLink to="/result" className="tab">
          result.log
        </NavLink>
        <NavLink to="/ranking" className="tab">
          ranking.txt
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;