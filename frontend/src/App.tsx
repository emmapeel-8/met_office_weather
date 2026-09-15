import React, {useState} from 'react';
import {Banner} from "./assets/Banner.tsx";
import {getWeatherReport, type WeatherReport} from "./api/weather.ts";

const cellStyle: React.CSSProperties = { padding: "8px 16px", textAlign: "center" };

function App(): React.ReactElement {
  const [postcode, setPostcode] = useState<string>("");
  const [report, setReport] = useState<WeatherReport | null>(null);
  const [error, setError] = useState<string>("");

  async function formHandler(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (postcode === "") return;

    try {
      const result = await getWeatherReport(postcode);
      setReport(result);
      setError("");
    } catch (err: any) {
      setReport(null);
      setError(err.message);
    }
  }
  function updatePostcode(data: React.ChangeEvent<HTMLInputElement>): void {
    setPostcode(data.target.value)
  }
  return <>
    <Banner />
    <form action="" onSubmit={formHandler}>
      <label htmlFor="postcodeInput"> Postcode: </label>
      <input type="text" id="postcodeInput" onChange={updatePostcode}/>
      <input type="submit" value="Submit"/>
    </form>
    {error && <p role="alert">{error}</p>}
    {report && (
      <section>
        <h2>Weather report for {report.location}</h2>
        <table style={{ margin: "16px auto 0", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={cellStyle}>Time</th>
              <th style={cellStyle}>Conditions</th>
              <th style={cellStyle}>Temperature</th>
              <th style={cellStyle}>Chance of rain</th>
              <th style={cellStyle}>Umbrella</th>
            </tr>
          </thead>
          <tbody>
            {report.forecast.map((entry) => (
              <tr key={entry.time}>
                <td style={cellStyle}>{new Date(entry.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                <td style={cellStyle}>{entry.description}</td>
                <td style={cellStyle}>{entry.temperature}°C</td>
                <td style={cellStyle}>{entry.probOfPrecipitation}%</td>
                <td style={cellStyle}>{entry.umbrella ?? "No umbrella needed"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    )}
  </>;
}
export default App;
