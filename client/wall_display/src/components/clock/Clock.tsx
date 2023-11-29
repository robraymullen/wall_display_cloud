import { useEffect, useState } from "react";
import './Clock.css';
import "bootstrap/dist/css/bootstrap.min.css";

const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getMonth(month: number | undefined): string {
    if (month === undefined) return "";  
    return months[month];
}

function Clock() {
    const [time, setTime] = useState<Date>();

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 5);

        return () => {
            clearInterval(intervalId);
        }
    }, []);

    return (
        <div>
            <div className="row timeRow">
                <div className="time">
                    <p>{time?.getHours()}:{String(time?.getMinutes()).padStart(2, '0')}:{String(time?.getSeconds()).padStart(2, '0')}</p>
                </div>
            </div>
            <div className="row">
                <div className="dateText">
                    <p>{time?.getDate()}, {getMonth(time?.getMonth())} {time?.getFullYear()}</p>
                </div>
            </div>
        </div>
    )
}

export default Clock;