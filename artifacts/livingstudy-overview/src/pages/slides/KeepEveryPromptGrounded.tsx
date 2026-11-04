export default function KeepEveryPromptGrounded() {
  return (
    <div className="deck-slide slide-sage w-screen h-screen overflow-hidden relative">
      <div className="deck-content">
        <h1 className="deck-title">Keep every prompt grounded</h1>
        <div className="mt-[8vh] grid grid-cols-12 gap-[2vw]">
          <ul className="deck-list deck-body col-span-7 space-y-[4.4vh]">
            <li>See the exact note sentence next to its prompt</li>
            <li>The initial answer quotes that sentence verbatim</li>
            <li>Local, rule-based extraction keeps the source visible for checking</li>
          </ul>
          <div className="col-span-5 flex items-center justify-center">
            <div className="relative w-full">
              <div className="rounded-[1vw] bg-[#f3efe3] px-[2vw] py-[2.6vh] shadow-[0_1.5vw_3vw_rgba(35,71,62,.12)]">
                <div className="space-y-[1.5vh]">
                  <div className="h-[.68vw] w-[92%] rounded-full bg-[#23473e]/30"></div>
                  <div className="h-[.68vw] w-[74%] rounded-full bg-[#23473e]/22"></div>
                </div>
              </div>
              <div className="mx-auto h-[8vh] w-[1px] bg-[#d77e5f]"></div>
              <div className="rounded-[1vw] border-[.18vw] border-[#d77e5f] bg-[#23473e] px-[2vw] py-[2.6vh]">
                <div className="space-y-[1.5vh]">
                  <div className="h-[.68vw] w-[92%] rounded-full bg-[#dce8d8]/70"></div>
                  <div className="h-[.68vw] w-[74%] rounded-full bg-[#dce8d8]/45"></div>
                </div>
              </div>
              <div className="absolute -right-[1.2vw] top-[42%] h-[2.4vw] w-[2.4vw] rounded-full border-[.25vw] border-[#d77e5f] bg-[#dce8d8]"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-[7vw] bottom-[6vh] h-[.16vw] w-[21vw] bg-[#d77e5f]"></div>
    </div>
  );
}
