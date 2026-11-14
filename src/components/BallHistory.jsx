"use client";
export default function BallHistory({ list }) {
  return (
    <div className="hist">
      {list.slice(-6).map((v, k) => (
        <span
          key={list.length - 6 + k}
          className={
            "ball " + (v === "OUT" ? "o" : v === 6 ? "s" : v === 4 ? "f" : "")
          }
        >
          {v}
        </span>
      ))}
    </div>
  );
}
