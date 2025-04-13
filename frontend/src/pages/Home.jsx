import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import { queryUser } from "../utils/queryUser";
import { updateUser } from "../utils/updateUser";

import { Header } from "../components/Header";
import { SignupComponent } from "../components/SignupComponent";

function Home({ apiRoute, authUser }) {
  const [queriedUser, setQueriedUser] = useState([]);
  const [childRegForm, setChildReqForm] = useState(false);
  const permissions = authUser.user.permissions;

  const statusHandler = (e, targetId) => {
    if (["approved", "rejected", "deleted"].includes(e.target.name)) {
      console.log(targetId);
      updateUser(apiRoute + "updateUser", targetId, e.target.name)
        .then((data) => {
          toast.success(data.message);
          queryUser(apiRoute + "queryUser")
            .then((data) => {
              if (data.users) {
                data.users.map((userData) => {
                  setQueriedUser((prevUsers) => [...prevUsers, userData]);
                });
              }
            })
            .catch((error) => {
              console.error(`Error in API : ${error}`);
            });
        })
        .catch((error) => {
          console.error(`Error in API : ${error}`);
        });
    }
  };

  useEffect(() => {
    queryUser(apiRoute + "queryUser")
      .then((data) => {
        if (data.users) {
          data.users.map((userData) => {
            setQueriedUser((prevUsers) => [...prevUsers, userData]);
          });
        }
      })
      .catch((error) => {
        console.error(`Error in API : ${error}`);
      });
  }, []);

  return (
    <>
      <div>
        <Toaster />
      </div>
      <Header authUser={authUser} />
      <section className="relative">
        <div
          className={`py-10 flex flex-col items-center justify-center flex-wrap gap-y-4 ${
            childRegForm && "bg-black/50 blur-md"
          }`}
        >
          <div className="mx-2 px-[5vw] py-6  rounded-xl flex flex-col justify-center items-center gap-y-5 shadow-2xl border-1 border-gray-700 ">
            <p className="text-2xl text-secondary font-bold">
              {authUser.user.role.charAt(0).toUpperCase() +
                authUser.user.role.slice(1)}{" "}
              user
            </p>
            <div className="py-2 flex flex-col gap-y-2">
              <div className="flex gap-x-4">
                <label className="font-bold text-accent">Name :</label>
                <p>{authUser.user.fullName}</p>
              </div>
              <div className="flex gap-x-4">
                <label className="font-bold text-accent">Email :</label>
                <p>{authUser.user.email}</p>
              </div>
              <div className="flex gap-x-4">
                <label className="font-bold text-accent">Number :</label>
                <p>{authUser.user.contactNumber}</p>
              </div>
              <div className="flex gap-x-4">
                <label className="font-bold text-accent">Role :</label>
                <p>{authUser.user.role}</p>
              </div>
              <div className="flex gap-x-4">
                <label className="font-bold text-accent">Status :</label>
                <p>{authUser.user.status}</p>
              </div>
            </div>
          </div>
          {permissions.length > 0 && (
            <div className="mx-2 md:w-[800px] sm:w-[400px] py-6  rounded-xl flex flex-col justify-center items-center gap-y-5 shadow-2xl border-1 border-gray-700 ">
              <div className="bg-base-300 w-[80%] flex items-center justify-center flex-col gap-y-5 py-4 rounded-sm">
                <p>Inactive Users</p>{" "}
                {queriedUser.map(
                  (userContext, userIdx) =>
                    userContext.status === "pending" && (
                      <div
                        key={userIdx}
                        className="p-2 w-[95%] border border-error/20 rounded-lg"
                      >
                        <div className="flex justify-between py-2 px-4">
                          <p className="text-success text-lg font-bold">
                            {userIdx + 1}.
                          </p>
                          <div className="flex gap-x-4">
                            <button
                              onClick={(e) => {
                                statusHandler(e, userContext._id);
                              }}
                              name="approved"
                              className=" btn btn-accent"
                            >
                              Approve
                            </button>
                            <button
                              onClick={(e) => {
                                statusHandler(e, userContext._id);
                              }}
                              name="rejected"
                              className=" btn btn-error text-base-content"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                        <div className="py-5 px-4">
                          <p className="text-info font-bold text-xl">
                            Name :{" "}
                            <span className="text-base-content text-lg">
                              {userContext.fullName}
                            </span>
                          </p>
                        </div>
                        <div className="py-5 px-4">
                          <p className="text-info font-bold text-xl">
                            Email :{" "}
                            <span className="text-base-content text-lg">
                              {userContext.email}
                            </span>
                          </p>
                        </div>
                        <div className="py-5 px-4">
                          <p className="text-info font-bold text-xl">
                            Contact Number :{" "}
                            <span className="text-base-content text-lg">
                              {userContext.contactNumber}
                            </span>
                          </p>
                        </div>
                        <div className="py-5 px-4">
                          <p className="text-info font-bold text-xl">
                            Role :{" "}
                            <span className="text-base-content text-lg">
                              {userContext.role}
                            </span>
                          </p>
                        </div>
                        <div className="py-5 px-4">
                          <p className="text-info font-bold text-xl">
                            Status :{" "}
                            <span className="text-base-content text-lg">
                              {userContext.status}
                            </span>
                          </p>
                        </div>
                      </div>
                    )
                )}
              </div>
              {permissions.map((permContext, permIdx) => (
                <section
                  className="w-full flex flex-col items-center"
                  key={permIdx}
                >
                  <div className="w-full px-4 py-2 flex items-center justify-between">
                    <p className="text-info font-bold">
                      {permContext.charAt(0).toUpperCase() +
                        permContext.slice(1)}{" "}
                      :
                    </p>
                    <button
                      onClick={() => setChildReqForm(true)}
                      className="bg-primary cursor-pointer px-4 py-2 font-bold rounded-full duration-100 hover:bg-gray-600"
                    >
                      <p className="">+</p>
                    </button>
                  </div>
                  <hr className="border-1 border-secondary my-5 w-[90%]" />
                  {queriedUser.map((userContext, userIdx) => {
                    if (
                      userContext.role === permContext &&
                      userContext.status === "approved"
                    ) {
                      return (
                        <div
                          className="bg-neutral w-[80%] my-4 mx-6 px-6 py-4 rounded-lg border border-base-300 shadow-2xl"
                          key={userIdx}
                        >
                          <div className="flex justify-between">
                            <p className="text-success text-lg font-bold">
                              {userIdx + 1}.
                            </p>
                          </div>
                          <div className="py-5 px-4">
                            <p className="text-info font-bold text-xl">
                              Name :{" "}
                              <span className="text-base-content text-lg">
                                {userContext.fullName}
                              </span>
                            </p>
                          </div>
                          <div className="py-5 px-4">
                            <p className="text-info font-bold text-xl">
                              Email :{" "}
                              <span className="text-base-content text-lg">
                                {userContext.email}
                              </span>
                            </p>
                          </div>
                          <div className="py-5 px-4">
                            <p className="text-info font-bold text-xl">
                              Contact Number :{" "}
                              <span className="text-base-content text-lg">
                                {userContext.contactNumber}
                              </span>
                            </p>
                          </div>
                          <div className="py-5 px-4">
                            <p className="text-info font-bold text-xl">
                              Role :{" "}
                              <span className="text-base-content text-lg">
                                {userContext.role}
                              </span>
                            </p>
                          </div>
                          <div className="py-5 px-4">
                            <p className="text-info font-bold text-xl">
                              Status :{" "}
                              <span className="text-base-content text-lg">
                                {userContext.status}
                              </span>
                            </p>
                          </div>
                          <div className="py-5 px-4">
                            <p className="text-info font-bold text-xl">
                              Login Attempt :{" "}
                              <span className="text-base-content text-lg">
                                {userContext.loginAttempt} out of 5
                              </span>
                            </p>
                          </div>
                          <div className="py-5 px-4">
                            <p className="text-info font-bold text-xl">
                              Created by :{" "}
                              <span className="text-base-content text-lg">
                                {userContext.createdBy === null
                                  ? "Self-Created"
                                  : userContext.createdBy}
                              </span>
                            </p>
                          </div>
                          <div className="py-5 px-4">
                            <p className="text-info font-bold text-xl">
                              Permissions :{" "}
                              <span className="text-base-content text-lg">
                                {userContext.permissions.length === 0
                                  ? "null"
                                  : userContext.permissions.join(", ")}
                              </span>
                            </p>
                          </div>
                          <div className="py-5 px-4">
                            <p className="text-info font-bold text-xl">
                              Last Login :{" "}
                              <span className="text-base-content text-lg">
                                {userContext.lastLogin}
                              </span>
                            </p>
                          </div>
                          <div className="py-5 px-4">
                            <p className="text-info font-bold text-xl">
                              Created At :{" "}
                              <span className="text-base-content text-lg">
                                {userContext.createdAt}
                              </span>
                            </p>
                          </div>
                          <div className="py-5 px-4">
                            <p className="text-info font-bold text-xl">
                              Updated At :{" "}
                              <span className="text-base-content text-lg">
                                {userContext.updatedAt}
                              </span>
                            </p>
                          </div>
                        </div>
                      );
                    }
                  })}
                </section>
              ))}
            </div>
          )}
        </div>

        {childRegForm && (
          <div className="h-[80vh] fixed inset-0 my-20 flex items-center justify-center">
            <SignupComponent
              authUser={authUser}
              setChildReqForm={setChildReqForm}
            />
          </div>
        )}
      </section>
    </>
  );
}

export default Home;
