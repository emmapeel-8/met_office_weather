import React, {useState} from 'react';
import {Banner} from "./assets/Banner.tsx";
import {getWeatherReport, type WeatherReport} from "./api/weather.ts";
import {getRandomPostcode} from "./api/postcode.ts";
import "./App.css"

const cellStyle: React.CSSProperties = { padding: "8px 16px", textAlign: "center" };

function App(): React.ReactElement {
  const [postcode, setPostcode] = useState<string>("");
  const [hours, setHours] = useState<number>(3);
  const [report, setReport] = useState<WeatherReport | null>(null);
  const [error, setError] = useState<string>("");
  const [significantWeatherCode, setSignificantWeatherCode] = useState<number>(1);
  const [postcodeRandom, setPostcodeRandom] = useState<string>();

  async function formHandler(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (postcode === "") return;

    try {
      const result = await getWeatherReport(postcode, hours);
      setReport(result);
      setSignificantWeatherCode(result.forecast[0].significantWeatherCode);
      setError("");
    } catch (err: any) {
      setReport(null);
      setError(err.message);
    }
  }
  function updatePostcode(data: React.ChangeEvent<HTMLInputElement>): void {
    setPostcode(data.target.value)
  }
  function updateHours(data: React.ChangeEvent<HTMLInputElement>): void {
    setHours(data.target.valueAsNumber)
  }
  async function selectRandomPostcode(): Promise<void> {
    setReport(null);
    try {
      const info = await getRandomPostcode();
      setPostcodeRandom(info.postcode);
      setPostcode(info.postcode);
    } catch (err: any) {
      setError(err.message);
    }
  }
  function selectManualPostcode(): void {
    setPostcodeRandom("");
    setPostcode("");
    setReport(null);
  }
  return <>
    <Banner significantWeatherCode={significantWeatherCode}></Banner>
    <div className="banner-content">
      <h1>Met Office Weather</h1>
      <p>Live local forecasts, wherever you are</p>
    </div>
    <div className="postcode-picker">
      <button
        type="button"
        className={postcodeRandom ? "active" : ""}
        onClick={selectRandomPostcode}
      >
        Get random postcode
      </button>
      <button
        type="button"
        className={postcodeRandom === "" ? "active" : ""}
        onClick={selectManualPostcode}
      >
        Input manual postcode (boring)
      </button>
    </div>
    {postcodeRandom !== undefined && (
      <form className="weather-form" action="" onSubmit={formHandler}>
        <label htmlFor="postcodeInput"> Postcode: </label>
        <input type="text" id="postcodeInput" placeholder={postcodeRandom} value={postcode} onChange={updatePostcode}/>
        <label htmlFor="hoursInput"> Hours: </label>
        <input type="number" id="hoursInput" min={1} step={1} value={hours} onChange={updateHours} style={{ width: "2em" }}/>
        <input type="submit" value="Submit"/>
      </form>
    )}
    {error && <p role="alert" className="error-message">{error}</p>}
    {report && (
      <section className="weather-report">
        <h2>Weather report for {report.location}</h2>
        <table className="weather-table">
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
