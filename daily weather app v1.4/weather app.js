let rainfall = [];

/* notes
2022-05-19 refactoring to remove multiple duties of each function -> separate functions
to improve: getrainfall data and remove multuple fetch requests
1. if function has specific function -> should only do that one thing ie
remove getLoc call from getcity()
2. UPDATE DESCRIPTIONS
*/

//note async function contains item to await, await must return promise

//call order of functions
async function updatePage() {
		City();
        await getLocation();
        await getWeather();
        isRaining();
        await getRainfall();
        hourlyPrecipitation();
        changeBackground();
        
}

//gets city name from input and returns as string, calls getLocation
 var City = function() {
    let city1 = (document.getElementById("inputLoc").value);
    city = city1[0].toUpperCase() + city1.substring(1);
    console.log(`1. City: ${city}`)
    document.getElementById("getCity").innerHTML = city;
    return City;
}

 function getLocation() {
    //get city lattitude and longitude
     return fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
        .then(data => data.json())
        .then(data => {
            //catch missing city location
            if (data.results === undefined) {
                console.log("DATA NOT FOUND");
                document.getElementById("notFound").innerHTML = "Warning: Location was not found in our database. Please check spelling and try again."
            }
            else { document.getElementById("notFound").innerHTML = "" };

            latitude = data.results[0].latitude.toString();
            longitude = data.results[0].longitude.toString();

            console.log("2. Longitude: " + longitude);
            console.log("2. Latitude: " + latitude);
            return latitude, longitude;
        })
}

    function getWeather() {
 
    //get weathercode data
    
    return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=precipitation&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=Europe%2FLondon`)
        .then(data => data.json())
        .then((data) => {
            console.log("3. Weather data:"); console.log(data); 
            let dailyWeather = undefined;

            //convert weathercode data to weather description
            switch (data.daily.weathercode[0]) {
                case 0:
                    dailyWeather = "Clear Sky"
                    break;
                case 1:
                    dailyWeather = "Mainly Clear";
                    break;
                case 2:
                    dailyWeather = "Partly Cloudy";
                    break;
                case 3:
                    dailyWeather = "Overcast";
                    break;
                case 45 || 48:
                    dailyWeather = "Fog";
                    break;
                case 51 || 53 || 55:
                    dailyWeather = "Drizzle";
                    break;
                case 56 || 57:
                    dailyWeather = "Freezing Drizzle";
                    break;
                case 61:
                    dailyWeather = "Light Rain";
                    break;
                case 62:
                    dailyWeather = "Moderate Rain";
                    break;
                case 63:
                    dailyWeather = "Heavy Rain";
                    break;
                case 66 || 67:
                    dailyWeather = "Freezing Rain";
                    break;
                case 71:
                    dailyWeather = "Light Snowfall";
                    break;
                case 73:
                    dailyWeather = "Moderate Snowfall";
                    break;
                case 75:
                    dailyWeather = "Heavy Raifall";
                    break;
                case 77:
                    dailyWeather = "Snow Grains";
                    break;
                case 80:
                    dailyWeather = "Light Rain Showers";
                    break;
                case 81:
                    dailyWeather = "Moderate Rain Showers";
                    break;
                case 82:
                    dailyWeather = "Heavy Rain Showers";
                    break;
                case 85:
                    dailyWeather = "Light Snow Showers";
                    break;
                case 86:
                    dailyWeather = "heavy Snow Showers";
                    break;
                case 95:
                    dailyWeather = "Thunderstorm";
                    break;
                case 96:
                    dailyWeather = "Thunderstorm with light hail";
                    break;
                case 99:
                    dailyWeather = "Thunderstorm with heavy hail";
                    break;
            }

            //update HTML ased on JSON data
            currentWeather = data.daily.weathercode[0];

            
            
            


            console.log(`4. current weather: ${currentWeather}`);
            console.log("Daily Weather:" + dailyWeather)
            document.getElementById("getTemp").innerHTML = `${data.daily.temperature_2m_max[0]} 'C`;
            document.getElementById("getWind").innerHTML = `${data.daily.windspeed_10m_max[0]} Km/h`;
            document.getElementById("getWeather").innerHTML = dailyWeather;
            
            return currentWeather
        })}
 
        function isRaining() {
            //update daily precipitation if raining
            if (currentWeather === 51 || currentWeather === 52 || currentWeather === 53 || currentWeather === 56 || currentWeather === 57 || currentWeather === 80 || currentWeather === 61 || currentWeather === 62 || currentWeather === 63 || currentWeather === 95) {
                console.log("5. It is raining.");
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=precipitation&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=Europe%2FLondon`)
             .then(data => data.json())
             .then((data) => {
                document.getElementById("getRainfall").innerHTML = `${data.daily.precipitation_sum[0]} mm`;
            })
        }
            else {
                console.log("5. Not raining")
                document.getElementById("getRainfall").innerHTML = "Not raining"    
            };
        }

            

            /*
            switch(data.daily.weathercode[0]) {
            case 0 || 1 || 2 || 3 || 45 ||48:
            console.log("5. Not raining")
            document.getElementById("getRainfall").innerHTML = "Not raining"
            break;
            case 51 || 53 || 55 || 56 || 57 || 61 || 62 || 63 || 66 || 67 ||71 ||73 ||75 ||77||80||81||82||85||86||95 ||96||99:
            console.log("5. It is raining.");
            document.getElementById("getRainfall").innerHTML = `${data.daily.precipitation_sum[0]} mm`
                break;               
            }
            */

 function getRainfall() {
    //get hourly preceding precipitation data and return
    
        return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=precipitation&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=Europe%2FLondon`)
        .then(data => data.json())
        .then((data) => {

            for (let i = 0; i < 24; i++) {rainfall.push(data.hourly.precipitation[i])};
            console.log(`Hourly precipitation: ${rainfall}`)       
        })  
}

function changeBackground() {
    //swapout background image based on weather
    console.log("7. Changing background.")
    let background = document.getElementById("backImg");

    //needs refactoring
    if (currentWeather === 2 || currentWeather === 3) {
        background.src = "/images/day/partly cloudy.jpg";
    }
    if (currentWeather === 0 || currentWeather === 1) {
        background.src = "/images/day/sunny.jpg";
    }
    if (currentWeather === 51 || currentWeather === 52 || currentWeather === 53 || currentWeather === 56 || currentWeather === 57 || currentWeather === 80 || currentWeather === 61 || currentWeather === 62 || currentWeather === 63) {
        background.src = "/images/day/rain.jpg";
    };
    if (currentWeather === 95) {
        background.src = "/Projects/2022-04-05 API basics/images/day/rain.jpg"
    };
    if (currentWeather === 45 || currentWeather === 48) {
        background.src = "/images/day/fog.jpg"
    };


    //snow

    //background.src = "/images/day/snow.jpg"

    //heavy cloud

    //thunder and lightning

};

function hourlyPrecipitation() {
    console.log("Plotting graph");
    

    //select last 24 values from rainfall to avoid multiple refrehes
    let data = [];
    for (let i = rainfall.length -24; i <rainfall.length ; i++) {data.push(rainfall[i])};
    const w = 600;
    const h = 200;
    const margin = 60;

    //create svg area
    let area = document.getElementById("stats")
    const svg = d3.select(area)
        .append("svg")
        .attr("width", w)
        .attr("height", h)

    //define scales scalebound for ordinal data, scalelinear for quantitative continues data
    const xScale = d3.scaleBand()
        .domain(d3.range(data.length)) //inputs / axis description
        .range([0, w - (2 * margin)]) //outputs / axis size

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([h - (2 * margin), 0])

    //plot the data to the svg area
    svg.append("g")
        .attr("transform", 'translate(' + margin + ',' + margin + ')') //add margins to svg area 
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("margin", "10px")
        .attr("x", (d, i) => { return xScale(i) }) //set to ordinals
        .attr("y", (d, i) => { return yScale(d) }) //y plotting data must match yScale formula
        .attr("width", xScale.bandwidth() - 5) //automatically set width (-5 to get a gap)
        .attr("height", (d, i) => { return h - (2 * margin) - yScale(d) })
        .attr("class", "bar")
        //spawning and placement of tooltips
        .on("mouseover", function (d) {

            tooltip.transition()
                .duration(200)
                .style("opacity", .9)
        })
        .on("mousemove", function (event, d) {
            const [x, y] = d3.pointer(event);		//get cooredinants of mouse
            tooltip.html(`<p>Rainfall: ${d} mm</p>`)
                .style("left", (x + 700) + "px")
                .style("top", (y + 200) + "px");
        })

        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        })

    //create tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    //plot the axis
    svg.append("g")
        .attr("transform", `translate(${margin}, ${h - margin} )`)
        .call(d3.axisBottom(xScale))


    svg.append("g")
        .attr("transform", `translate(${margin}, ${margin})`)
        .call(d3.axisLeft(yScale))

    //axis labels

    svg.append("text")      // text label for the x axis
        .attr("x", w / 2)
        .attr("y", h - margin + (margin / 1.25))
        .attr("class", "label")
        .text("Preceding hour");

    svg.append("text")  //text label for y axis
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - (h / 2))
        .attr("dy", "1em")
        .attr("class", "label")
        .text("Rainfall /mm");
}