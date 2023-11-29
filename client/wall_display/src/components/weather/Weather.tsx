import './Weather.css';
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface WeatherProps {
    weatherReport: any;
}
function Weather({weatherReport}: WeatherProps) {

    const isUndefined = weatherReport === undefined || Object.keys(weatherReport).length == 0;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const now = new Date();
    const tomorrow = (now.getDay() + 1) % 7;
    const overMomorrow = (now.getDay() + 2) % 7;

    return (
        <div className="row">
            {
            isUndefined ? <div></div>
            :
            <div>
            {
                    weatherReport?.list.map((weather: any, key:any) => {
                        return (
                            <div key={key} className="row innerRow">
                                <div className="col-sm-3">
                                    {
                                        key == 0 ? 
                                            <h3>Today</h3>
                                        : key == 1 ?
                                                <h3>{days[tomorrow]}</h3>
                                        : <h3>{days[overMomorrow]}</h3>
                                    }
                                </div>
                                <div className="col-sm-3">
                                    <h3>{weather?.temp.day}<span>&#8451;</span></h3>
                                </div>
                                <div className="col-sm-2">
                                    <div className="row">
                                        <p>Highs: {weather?.temp.max}</p>
                                    </div>
                                    <div className="row">
                                        <p>Lows: {weather?.temp.min}</p>
                                    </div>
                                </div>
                                <div className="col-sm-2">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <img src={"http://openweathermap.org/img/wn/"+weather?.weather[0].icon+".png"} />
                                        </div>
                                        <div className="col-sm-6">
                                            <h5>{weather?.weather[0].description}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            }
        </div>
    )
}

export default Weather;