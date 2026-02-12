export default function About() {
  return (
    <>
      <h2 className="page-title">About Decision Helper</h2>
      <p className="page-subtitle">A simple decision tool that reduces stress by forcing clarity.</p>

      <section className="cardish mb-3">
        <p className="mb-0">
          Decision Helper is a web application meant to assist in decision-making and reduce stress by helping break
          down choices into options, criteria, and weighted priorities.
        </p>
      </section>

      <section className="cardish mb-3">
        <h3 className="h5 mb-2">How It Works</h3>
        <p className="mb-0">
          Users define their options, specify relevant criteria and assign them priority, then receive a ranked
          recommendation based off of the weighted scores.
        </p>
      </section>

      <section className="cardish mb-3">
        <h3 className="h5 mb-3">Example Image</h3>
        <img
          src="/DecisionHelper.png"
          alt="Decision Helper application concept image"
          width="600"
        />
      </section>

      <section className="cardish">
        <h3 className="h5 mb-2">External Data (3rd-party API placeholder)</h3>
        <p className="mb-0">
          This section will eventually display the data retrieved from a third-party API: possibly productivity tips,
          decision-making quotes, or contextual data to assist users.
        </p>
      </section>
    </>
  );
}
