export const fetchData = async (latitude: number, longitude: number) => {
    try {
        const response = await fetch(`https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/hourly?latitude=${latitude}&longitude=${longitude}`, {
            headers: {
                accept: "application/json",
                apikey: process.env.MET_OFFICE_API_KEY ?? "",
            },
        });
        return response.json();
    } catch (error: any) {
        console.error(error)
        return error;
    } finally {
        console.log("Request complete")
    }
}

