"use client";

import { Tweet } from "react-tweet";

export default function TweetEmbed({ id }: { id: string }) {
  return (
    <div className="w-full max-w-[550px] tweet-container">
      <Tweet id={id} />
      <style jsx global>{`
        .tweet-container .react-tweet-theme {
          --tweet-bg-color: transparent !important;
          background-color: transparent !important;
        }
      `}</style>
    </div>
  );
}
