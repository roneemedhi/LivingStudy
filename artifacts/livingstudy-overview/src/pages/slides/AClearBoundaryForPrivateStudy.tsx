export default function AClearBoundaryForPrivateStudy() {
  return (
    <div className="deck-slide slide-spruce w-screen h-screen overflow-hidden relative">
      <div className="deck-content grid grid-cols-12 gap-[3vw]">
        <div className="col-span-6 flex flex-col justify-center">
          <h1 className="deck-title">A clear boundary for private study</h1>
          <div className="mt-[5vh] h-[.18vw] w-[12vw] bg-[#d77e5f]"></div>
        </div>
        <ul className="deck-list deck-body col-span-6 flex flex-col justify-center gap-[4.6vh] text-[#f3efe3]">
          <li>The passphrase screen is a simulated demo lock, not real account security</li>
          <li>LocalStorage data is not encrypted</li>
          <li>Use a private browser profile and avoid sensitive notes on shared devices</li>
        </ul>
      </div>
      <div className="absolute -right-[7vw] -top-[19vh] h-[58vh] w-[35vw] rounded-full border-[.1vw] border-[#819788]/40"></div>
      <div className="absolute right-[4vw] top-[10vh] h-[.9vw] w-[.9vw] rounded-full bg-[#d77e5f]"></div>
    </div>
  );
}
