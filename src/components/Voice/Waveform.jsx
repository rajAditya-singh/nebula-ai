function Waveform({ volume = 0 }) {
  return (
    <div className="waveform">
      {[...Array(25)].map((_, index) => {
        const randomHeight = Math.random() * volume;

        const height = Math.max(8, randomHeight + 5);

        return (
          <span
            key={index}
            className="wave-bar"
            style={{
              height: `${height}px`,
            }}
          />
        );
      })}
    </div>
  );
}

export default Waveform;
