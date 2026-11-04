export default function YourReviewIsTheGate() {
  return (
    <div className="deck-slide slide-paper w-screen h-screen overflow-hidden relative">
      <div className="deck-content">
        <h1 className="deck-title">Your review is the gate</h1>
        <div className="mt-[7vh] grid grid-cols-12 gap-[4vw]">
          <div className="col-span-8 grid grid-cols-2 gap-x-[3vw] gap-y-[5vh]">
            <div className="border-t-[.16vw] border-[#d77e5f] pt-[2.2vh]">
              <p className="deck-body m-0">Approve only when the answer matches its source sentence</p>
            </div>
            <div className="border-t-[.16vw] border-[#819788] pt-[2.2vh]">
              <p className="deck-body m-0">Edit &amp; Save keeps changes pending for a separate decision</p>
            </div>
            <div className="border-t-[.16vw] border-[#819788] pt-[2.2vh]">
              <p className="deck-body m-0">Discard permanently removes a pending prompt</p>
            </div>
            <div className="border-t-[.16vw] border-[#d77e5f] pt-[2.2vh]">
              <p className="deck-body m-0">Nothing enters the library automatically</p>
            </div>
          </div>
          <div className="col-span-4 flex items-center justify-center">
            <div className="relative flex h-[42vh] w-[21vw] items-center justify-center rounded-[1.2vw] bg-[#dce8d8]">
              <div className="absolute inset-[2vw] rounded-[.9vw] border border-[#819788]/50"></div>
              <div className="flex h-[10vw] w-[10vw] items-center justify-center rounded-full border-[.5vw] border-[#23473e]">
                <svg viewBox="0 0 100 100" className="h-[5vw] w-[5vw]" aria-hidden="true">
                  <path d="m20 52 19 19 42-45" fill="none" stroke="#d77e5f" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="absolute bottom-[3vh] left-[3vw] h-[.55vw] w-[7vw] rounded-full bg-[#819788]/55"></div>
              <div className="absolute bottom-[3vh] right-[3vw] h-[.55vw] w-[3vw] rounded-full bg-[#d77e5f]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
