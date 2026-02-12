export default function Scores() {
  return (
    <>
      <h2 className="page-title">Saved Decisions</h2>
      <p className="page-subtitle">This page displays previously saved decision results.</p>

      <section className="cardish mb-3">
        <h3 className="h5 mb-2">Decision History (Database placeholder)</h3>
        <p>Decision results will eventually be loaded from the database and displayed here.</p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Decision</th>
                <th>Top Result</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2026-01-01</td>
                <td>Example Decision</td>
                <td>Option A</td>
                <td>92</td>
              </tr>
              <tr>
                <td>2026-01-02</td>
                <td>Another Example</td>
                <td>Option B</td>
                <td>87</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="cardish">
        <h3 className="h5 mb-2">Live Updates (WebSocket placeholder)</h3>
        <p>
          In a future deliverable, this area will show real-time updates using WebSockets, such as when decision scores
          change.
        </p>

        <div>
          <p className="mb-1">
            <em>Status:</em> Not connected
          </p>
          <p className="mb-0">
            <em>Last update:</em> —
          </p>
        </div>
      </section>
    </>
  );
}
