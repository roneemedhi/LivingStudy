export default function YourStudyDataStaysInThisBrowser() {
  return (
    <div className="deck-slide slide-paper w-screen h-screen overflow-hidden relative">
      <div className="deck-content grid grid-cols-12 gap-[3vw]">
        <div className="col-span-5 flex flex-col justify-center">
          <h1 className="deck-title">Your study data stays in this browser</h1>
          <div className="mt-[5vh] h-[.18vw] w-[11vw] bg-[#d77e5f]"></div>
        </div>
        <div className="col-span-7 flex flex-col justify-center gap-[4.5vh]">
          <p className="deck-body m-0">Notes, cards, settings, and progress persist in LocalStorage</p>
          <p className="deck-body m-0">Note parsing and quiz checks run locally; the app does not send notes to an AI or server</p>
          <p className="deck-body m-0">A local passphrase screen appears again after reload</p>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 h-[22vh] w-[27vw] bg-[#dce8d8]"></div>
      <div className="absolute bottom-[8vh] right-[8vw] h-[15vh] w-[11vw] rounded-[1.2vw] border-[.3vw] border-[#23473e] bg-[#f3efe3]">
        <div className="absolute left-1/2 top-[3vh] h-[3.3vw] w-[3.3vw] -translate-x-1/2 rounded-full border-[.28vw] border-[#d77e5f]"></div>
        <div className="absolute left-1/2 top-[6.5vw] h-[3vw] w-[5vw] -translate-x-1/2 rounded-t-[3vw] bg-[#23473e]"></div>
      </div>
    </div>
  );
}
