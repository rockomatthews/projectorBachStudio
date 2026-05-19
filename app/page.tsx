import { AuditionForm } from "@/components/audition-form";
import { AutoAudio } from "@/components/auto-audio";

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">Park City, Utah / masked electric metal</p>
          <div className="logo-slot" aria-label="Projector Bach logo space">
            <span>Logo goes here</span>
          </div>
          <h1 id="page-title">Projector Bach needs bodies behind the masks.</h1>
          <p className="bio">
            Projector Bach is the premiere Electric Metal band in Park City:
            blown circuits, baroque violence, mountain-town menace, and a stage
            full of masks. Right now the band is one person. That changes now.
          </p>
        </div>

        <aside className="callout" aria-label="Recruitment callout">
          <p className="callout-kicker">Guitar / bass / drums / synth / noise</p>
          <p>
            If you can make the room shake, keep time, show up, and commit to
            the ritual, submit an audition.
          </p>
          <AutoAudio />
        </aside>
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
