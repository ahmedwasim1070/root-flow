import { Link } from "react-router-dom";
export const Header = ({ authUser }) => {
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <p className="text-info px-4 text-xl font-bold">
            {authUser.user.fullName}
          </p>
        </div>
        <div className="navbar-end">
          <Link to="/logout" className="btn btn-accent">
            Logout
          </Link>
        </div>
      </div>
    </>
  );
};
