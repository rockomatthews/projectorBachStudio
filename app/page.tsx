import { AuditionForm } from "@/components/audition-form";
import { AutoAudio } from "@/components/auto-audio";

export default function Home() {
  return (
    <main className="site-shell">
      <AutoAudio />
      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">Park City, Utah / masked electric metal</p>
          <div className="logo-slot" aria-label="Projector Bach logo space">
            <span>Logo goes here</span>
          </div>
          <h1 id="page-title">
            Audition for Park City&apos;s Premiere Electronic Metal Band-
            Projector Bach
          </h1>
          <p className="bio">
            Blown circuits, baroque violence, mountain-town menace, and a
            stage full of masks. Right now the band is one person. That changes
            now.
          </p>
        </div>
      </section>

      <section className="form-section" aria-labelledby="audition-title">
        <div className="section-header">
          <p className="eyebrow">Audition intake</p>
          <h2 id="audition-title">Upload the proof first.</h2>
          <p>
            Drop a file or paste a link, then tell Projector Bach who you are
            and what kind of sonic damage you can do.
          </p>
        </div>
        <AuditionForm />
      </section>
    </main>
  );
}
