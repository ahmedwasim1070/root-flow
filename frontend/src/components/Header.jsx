import { Link } from "react-router-dom";
export const Header = ({ authUser }) => {
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">{authUser.user.fullName}</a>
        </div>
        <div className="navbar-end">
          <Link to="/logout" className="btn">
            Logout
          </Link>
        </div>
      </div>
    </>
  );
};
