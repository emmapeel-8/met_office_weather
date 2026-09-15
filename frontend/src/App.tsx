import React, {useState} from 'react';
import {Banner} from "./assets/Banner.tsx";
import {getWeatherReport} from "./api/weather.ts";

async function getForecast(postcode: string): Promise<string> {
  if (postcode === "") return "";

  try {
    const report = await getWeatherReport(postcode);
    return JSON.stringify(report, null, 4);
  } catch (error: any) {
    return error.message;
  }
}

function App(): React.ReactElement {
  const [postcode, setPostcode] = useState<string>("");
  const [tableData, setTableData] = useState<string>("");

  async function formHandler(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault(); // to stop the form refreshing the page when it submits
    const data = await getForecast(postcode);
    setTableData(data);
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
    {JSON.stringify(tableData, null, 4) /* this will just render the string - try creating a table 'dynamically'! */}
  </>;
}
export default App;