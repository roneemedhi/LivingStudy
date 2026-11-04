export default function StartWithYourOwnWords() {
  return (
    <div className="deck-slide slide-paper w-screen h-screen overflow-hidden relative">
      <div className="deck-content grid grid-cols-12 gap-[2vw]">
        <div className="col-span-7 flex flex-col">
          <h1 className="deck-title">Start with your own words</h1>
          <ul className="deck-list deck-body mt-[7vh] space-y-[4.1vh]">
            <li>Paste product-management notes into your study desk</li>
            <li>LivingStudy splits the text into sentences in your browser</li>
            <li>Each sentence becomes a review prompt with the original text beside it</li>
          </ul>
        </div>
        <div className="col-span-5 flex items-center justify-center">
          <div className="relative w-[33vw]">
            <div className="rotate-[-4deg] rounded-[1.3vw] bg-[#173b35] p-[2.4vw] shadow-[0_2vw_5vw_rgba(35,71,62,.18)]">
              <div className="h-[.7vw] w-[8vw] rounded-full bg-[#d77e5f]"></div>
              <div className="mt-[4vh] space-y-[1.6vh]">
                <div className="h-[.7vw] w-full rounded-full bg-[#dce8d8]/55"></div>
                <div className="h-[.7vw] w-[89%] rounded-full bg-[#dce8d8]/45"></div>
                <div className="h-[.7vw] w-[70%] rounded-full bg-[#dce8d8]/35"></div>
                <div className="h-[.7vw] w-[95%] rounded-full bg-[#dce8d8]/45"></div>
              </div>
              <div className="my-[4vh] h-[1px] w-full bg-[#819788]/50"></div>
              <div className="space-y-[1.6vh]">
                <div className="h-[.7vw] w-[78%] rounded-full bg-[#819788]/60"></div>
                <div className="h-[.7vw] w-[62%] rounded-full bg-[#819788]/45"></div>
              </div>
            </div>
            <div className="absolute -right-[1.3vw] -bottom-[5vh] h-[15vh] w-[13vw] rotate-[7deg] rounded-[1vw] border-[.35vw] border-[#d77e5f] bg-[#f3efe3] p-[1.7vw]">
              <div className="h-[.65vw] w-[75%] rounded-full bg-[#23473e]/30"></div>
              <div className="mt-[2vh] h-[.65vw] w-full rounded-full bg-[#23473e]/20"></div>
              <div className="mt-[2vh] h-[.65vw] w-[68%] rounded-full bg-[#23473e]/20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
