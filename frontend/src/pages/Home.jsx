import { Header } from "../components/Header";

function Home({ authUser }) {
  return (
    <>
      <Header authUser={authUser} />
      <div className="mx-2 px-4 py-6 w-[25vw] rounded-xl flex flex-col justify-center items-center gap-y-5 border ">
        <div className="flex gap-x-4">
          <label className="font-bold">Name :</label>
          <p>{authUser.user.fullName}</p>
        </div>
        <div className="flex gap-x-4">
          <label className="font-bold">Email :</label>
          <p>{authUser.user.email}</p>
        </div>
        <div className="flex gap-x-4">
          <label className="font-bold">Number :</label>
          <p>{authUser.user.contactNumber}</p>
        </div>
        <div className="flex gap-x-4">
          <label className="font-bold">Role :</label>
          <p>{authUser.user.role}</p>
        </div>
        <div className="flex gap-x-4">
          <label className="font-bold">Status :</label>
          <p>{authUser.user.status}</p>
        </div>
        <a className="btn">Settings</a>
      </div>
      <div>{JSON.stringify({ authUser })}</div>
    </>
  );
}

export default Home;
