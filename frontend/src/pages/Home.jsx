function Home(authUser) {
  return (
    <>
      <h1>Home</h1>
      <div>
        <p>{JSON.stringify(authUser)}</p>
      </div>
    </>
  );
}

export default Home;
