import { AudioRecordingContent } from "./audio-recording-content";
import RecordingCardSkeleton from "../AudioRecordingContentSkeleton";
import { Suspense, ViewTransition } from "react";
import Link from "next/link";
import styles from "../../styles/ufo-card-styles.scss";

export default async function Page({ params }: { params: Promise<{id: string}> }) {
  const { id } = await params;

  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      default="none"
    >
      <div>
        <div
          style={{
            position: 'absolute',
            padding: '1rem',
            color: 'white',
            zIndex: '999'
          }}
        >
          <Link
            href={"/audio-recordings"}
            transitionTypes={["nav-back"]}
            style={{ viewTransitionName: "gallery-back-link" }}
          >
            ← UFO Cards
          </Link>
        </div>
        <Suspense
          fallback={
            <ViewTransition exit={"slide-down"}>
              <RecordingCardSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition enter={'slide-up'} default={'none'}>
            <AudioRecordingContent id={id} />
          </ViewTransition>
        </Suspense>
      </div>
    </ViewTransition>
  )
}