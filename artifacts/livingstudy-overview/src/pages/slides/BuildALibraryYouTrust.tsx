export default function BuildALibraryYouTrust() {
  return (
    <div className="deck-slide slide-paper w-screen h-screen overflow-hidden relative">
      <div className="deck-content grid grid-cols-12 gap-[2vw]">
        <div className="col-span-5 flex flex-col justify-center">
          <h1 className="deck-title">Build a library you trust</h1>
          <div className="mt-[6vh] h-[.18vw] w-[13vw] bg-[#d77e5f]"></div>
        </div>
        <div className="col-span-7 flex flex-col justify-center gap-[4.2vh]">
          <p className="deck-body m-0 border-b border-[#819788]/45 pb-[3vh]">The Master Knowledge Library contains approved items only</p>
          <p className="deck-body m-0 border-b border-[#819788]/45 pb-[3vh]">Search by words across prompts, answers, and source sentences</p>
          <p className="deck-body m-0">Keep the original note context attached to each saved card</p>
        </div>
      </div>
      <div className="absolute right-[7vw] top-[7vh] h-[8vw] w-[8vw] rounded-full bg-[#dce8d8]"></div>
      <div className="absolute right-[9.8vw] top-[9.8vh] h-[2.4vw] w-[2.4vw] rounded-full bg-[#d77e5f]"></div>
    </div>
  );
}
