export default function PracticeTheWayYouRemember() {
  return (
    <div className="deck-slide slide-sage w-screen h-screen overflow-hidden relative">
      <div className="deck-content">
        <h1 className="deck-title">Practice the way you remember</h1>
        <div className="mt-[7vh] grid grid-cols-12 gap-x-[3vw] gap-y-[5.5vh]">
          <div className="col-span-6 border-t-[.16vw] border-[#23473e] pt-[2.2vh]">
            <p className="deck-body m-0">Flashcard: recall first, then reveal the source answer</p>
          </div>
          <div className="col-span-6 border-t-[.16vw] border-[#d77e5f] pt-[2.2vh]">
            <p className="deck-body m-0">Write it out: type a response and check it against the saved answer</p>
          </div>
          <div className="col-span-6 border-t-[.16vw] border-[#819788] pt-[2.2vh]">
            <p className="deck-body m-0">Pick an answer: choose among items from your approved library</p>
          </div>
          <div className="col-span-6 border-t-[.16vw] border-[#23473e] pt-[2.2vh]">
            <p className="deck-body m-0">Track questions practiced, correct recalls, and study streaks</p>
          </div>
        </div>
        <div className="absolute bottom-[8vh] right-[7vw] flex items-end gap-[.8vw]">
          <div className="h-[4vh] w-[1.3vw] rounded-t-full bg-[#819788]"></div>
          <div className="h-[8vh] w-[1.3vw] rounded-t-full bg-[#23473e]"></div>
          <div className="h-[12vh] w-[1.3vw] rounded-t-full bg-[#d77e5f]"></div>
          <div className="h-[6vh] w-[1.3vw] rounded-t-full bg-[#23473e]/55"></div>
        </div>
      </div>
    </div>
  );
}
