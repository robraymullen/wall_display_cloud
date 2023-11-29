import './App.css';
import News from './components/news/News';
import "bootstrap/dist/css/bootstrap.min.css";
import Clock from './components/clock/Clock';
import Calendar from './components/calendar/Calendar';
import { useEffect, useState } from 'react';
import Weather from './components/weather/Weather';
import { start } from 'repl';
import weather from './weather.json';

const styles =  {
  appContainer: {
    backgroundImage: "url(./images/morning.jpg) no-repeat center center fixed",
    height: "100vh",
    margin: "0",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minWidth: "100%",
    minHeight: "100%"
  },
  news: {
    textAlign: "right"
  },
  zeroMargin: {
    margin: "0"
  }
}

function App() {

  const [weatherReport, setWeatherReport] = useState<any>({});
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [apiCallCount, setApiCallCount] = useState<number>(0);

  const images = ["./images/morning.jpg", "./images/noon.jpg", "./images/night.jpg"];

  const backgroundImageStyle = {
    backgroundImage: `url(${images[imageIndex]})`,
    height: "100vh",
    width: "100%",
    // backgroundSize: "100%",
    backgroundRepeat: "no-repeat",
    margin: "auto",
    backgroundPosition: "center",
    backgroundSize: "cover",
    maxWidth: "100%",
    maxHeight: "100%"
  };
  
  const inWeather = weather;


  useEffect(() => {
    const startWeatherUpdates = async () => {
      let weatherLocal: any = {};

      const getWeather = async () => {
        if (apiCallCount < 1) {
          setApiCallCount(apiCallCount+1);
          fetch("http://api.openweathermap.org/data/2.5/forecast/daily?q=Clane,ie&units=metric&cnt=3&=&appid=0f4449173c5906eab99896883e8466df")
          .then(response => response.json())
              .then((res) => {
                  // inWeather.city.coord.lat += 0.00001; 
                  weatherLocal = res;
                  setWeatherReport(res);
              }).catch(error => {
                  inWeather.city.coord.lat += 0.00001;
                  weatherLocal = inWeather;
                  setWeatherReport(inWeather);
              });
        } else {
          console.log("exceeded api call quota: "+apiCallCount);
        }
        

      };
      await getWeather();
  
      setInterval(async () => {
        const tempDate = new Date();
        const isNewDay = currentDate.getDate() !== tempDate.getDate();
        const isNewHour = currentDate.getHours() !== tempDate.getHours();
        if (isNewDay) {
          setCurrentDate(new Date());
          await getWeather();
        }

        if (isNewHour) {
          setCurrentDate(new Date());
          setApiCallCount(0);
        }

        if (weatherLocal.list !== undefined) {
          const sunrise = weatherLocal.list[0].sunrise * 1000;
          const sunset = weatherLocal.list[0].sunset * 1000;
          if (tempDate.getTime() > sunrise && tempDate.getHours() < 12) { //morning
            setImageIndex(0);
          } else if (tempDate.getHours() > 12 && tempDate.getHours() < 7) { // noon
            setImageIndex(1);
          } else { // night
            setImageIndex(2);
          }
        }
        
      }, 30000);
    };

    startWeatherUpdates();
  }, []);

  


  return (
    <div className="App container-fluid g-0" style={backgroundImageStyle}>
      <div className="g-0">
        <div className="row g-0">
          <div className="col-sm-6" >
            <Clock></Clock>
          </div>
          <div className="col-sm-2 offset-sm-4">
            <Calendar isBirthdays={false}></Calendar>
          </div>
        </div>
        <div className="row offset-md-2 g-0">
          <div className="col-md-8">
            <News></News>
          </div>
        </div>
        <div className="container bottomRow">
            <div className="row flexCols g-0">
                <Weather weatherReport={weatherReport}></Weather> 
            </div>
        </div>
        <div className="bottomRight">
              <div className="row g-0 flexCols">
                <Calendar isBirthdays={true}></Calendar>  
              </div>
        </div>
      </div>
      
    </div>
  );
}

export default App;
