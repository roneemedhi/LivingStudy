export default function LivingStudy() {
  return (
    <div className="deck-slide slide-spruce w-screen h-screen overflow-hidden relative">
      <div className="deck-content flex flex-col justify-between">
        <div className="mono-label text-[#dce8d8]">LivingStudy</div>
        <div className="grid grid-cols-12 items-end gap-[2vw]">
          <div className="col-span-7 pb-[4vh]">
            <h1 className="display-serif m-0 text-[8.1vw] leading-[.88] font-semibold tracking-[-.055em] text-[#f3efe3]">
              LivingStudy
            </h1>
            <p className="mt-[4.2vh] max-w-[54vw] text-[2.45vw] leading-[1.28] font-medium tracking-[-.02em] text-[#dce8d8]">
              Turn product notes into active recall—one source-anchored prompt at a time.
            </p>
          </div>
          <div className="col-span-5 relative h-[58vh]">
            <div className="absolute right-[7vw] top-[3vh] h-[43vh] w-[25vw] rotate-[-8deg] rounded-[1.1vw] border border-[#819788]/50 bg-[#23473e] p-[2vw] shadow-[0_2vw_5vw_rgba(0,0,0,.18)]">
              <div className="h-[.7vw] w-[7vw] rounded-full bg-[#819788]"></div>
              <div className="mt-[4vh] space-y-[1.7vh]">
                <div className="h-[.65vw] w-full rounded-full bg-[#819788]/60"></div>
                <div className="h-[.65vw] w-[81%] rounded-full bg-[#819788]/50"></div>
                <div className="h-[.65vw] w-[90%] rounded-full bg-[#819788]/40"></div>
              </div>
              <div className="mt-[5vh] h-[12vh] rounded-[.7vw] bg-[#dce8d8]/10 p-[1.6vw]">
                <div className="h-[.55vw] w-[68%] rounded-full bg-[#dce8d8]/60"></div>
                <div className="mt-[1.4vh] h-[.55vw] w-[88%] rounded-full bg-[#dce8d8]/35"></div>
              </div>
              <div className="mt-[4vh] h-[8vh] rounded-[.7vw] border border-[#d77e5f]/70"></div>
            </div>
            <div className="absolute right-[1vw] bottom-[1vh] h-[37vh] w-[23vw] rotate-[7deg] rounded-[1.1vw] bg-[#f3efe3] p-[2vw] shadow-[0_2vw_5vw_rgba(0,0,0,.22)]">
              <div className="h-[.7vw] w-[9vw] rounded-full bg-[#d77e5f]"></div>
              <div className="mt-[4vh] h-[.65vw] w-full rounded-full bg-[#23473e]/20"></div>
              <div className="mt-[1.5vh] h-[.65vw] w-[82%] rounded-full bg-[#23473e]/20"></div>
              <div className="mt-[4vh] h-[14vh] rounded-[.8vw] bg-[#dce8d8] p-[1.6vw]">
                <div className="h-[.55vw] w-[72%] rounded-full bg-[#23473e]/45"></div>
                <div className="mt-[1.5vh] h-[.55vw] w-[90%] rounded-full bg-[#23473e]/25"></div>
                <div className="mt-[1.5vh] h-[.55vw] w-[63%] rounded-full bg-[#23473e]/25"></div>
              </div>
              <div className="mt-[4vh] flex justify-end">
                <div className="h-[3.2vw] w-[3.2vw] rounded-full bg-[#d77e5f]"></div>
              </div>
            </div>
            <svg className="absolute left-[1vw] top-[21vh] h-[15vh] w-[13vw]" viewBox="0 0 250 150" fill="none" aria-hidden="true">
              <path d="M5 110C70 10 150 10 230 72" stroke="#d77e5f" strokeWidth="4" strokeDasharray="8 12" />
              <path d="m212 57 20 15-23 7" stroke="#d77e5f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="h-[1px] w-full bg-[#819788]/45"></div>
      </div>
      <div className="absolute bottom-[4vh] right-[7vw] h-[1vw] w-[1vw] rounded-full bg-[#d77e5f]"></div>
    </div>
  );
}
