import './Calendar.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';

interface Event {
    summary: string;
    start: EventStart;
    id: string;
}

interface EventStart {
    date?: string;
    dateTime?: string;
}

interface CalendarProps {
    isBirthdays: boolean;
}

const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getMonth(month: number | undefined): string {
    if (month === undefined) return "";  
    return months[month];
}

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getDay(dayNum: number | undefined): string {
    if (dayNum === undefined) return "";
    return days[dayNum];
}

function Calendar({isBirthdays}: CalendarProps) {

    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        let url = "/api/events";
        let intervalPeriod = 3600000; //1 hour, 1 day = 86400
        if (isBirthdays) {
            url = "/api/birthdays";
            intervalPeriod = 86400000;
        }
        let retryCount = 0;

        const getEvents = () => {
            fetch(url).then(res => res.json())
                .then((result: any) => {
                    const firstThree = result.items.slice(0, 3);
                    setEvents(firstThree);
                }).catch((error: any) => {
                    console.log(`Error fetching ${url} retrying....`)
                    retryCount += 1;
                    if (retryCount < 10) {
                        setTimeout(() => {
                            getEvents();
                        }, 60000); // 1min
                    } else {
                        console.log(`Gave up fetch to ${url} after ${retryCount} tries.`)
                        console.log(error);
                    }
                    
                });
        };

        getEvents();

        const intervalId = setInterval(() => {
            getEvents();
        }, intervalPeriod);

        return () => {
            clearInterval(intervalId);
        }
        

    }, []);

    return (
        <div>
            {
                isBirthdays ?
                <div className="row g-0">
                <div className="eventsTitle">
                    <span>Birthdays</span>
                </div>
                {
                    events !==undefined && events.length > 0 ?

                        events.map((calendarEvent: Event, i: number) => {
                                
                            return (
                                <div className="col-auto birthdayEvent" key={calendarEvent.id}>
                                    <div className="row g-0">
                                        <h2><b>{calendarEvent.summary}</b></h2>
                                    </div>
                                    <div className="row g-0">
                                        <span>{getDay((new Date(calendarEvent.start.date!)).getDay())} {(new Date(calendarEvent.start.date!)).getDate()}, {getMonth((new Date(calendarEvent.start.date!)).getMonth())}</span>
                                    </div>
                                </div>
                            )
                        })
                    :
                    <div></div>
                }
                </div>
                :
                <div className="row g-0">
                        <div className="eventsTitle">
                            <span><small>Upcoming events</small></span>
                        </div>
                {
                    events !==undefined && events.length > 0 ?
                        events.map((calendarEvent: Event, i: number) => {
                                    
                            return (
                                <div key={calendarEvent.id}>
                                    <div className="calendarEvent" >
                                        <div className="row g-0">
                                            <span><b>{calendarEvent.summary}</b></span>
                                        </div>
                                        <div className="row g-0">
                                        <span>{getDay((new Date(calendarEvent.start.dateTime!)).getDay())} {(new Date(calendarEvent.start.dateTime!)).getDate()}, {getMonth((new Date(calendarEvent.start.dateTime!)).getMonth())}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    :
                    <div></div>
                    
                }
                </div>
            }
        </div>
    )
}

export default Calendar;