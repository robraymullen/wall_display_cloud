extern crate google_calendar3 as calendar;
extern crate hyper;
extern crate hyper_rustls;
extern crate yup_oauth2;
extern crate reqwest;
extern crate scraper;

use serde::{Serialize, Deserialize};
use scraper::{Html, Selector};
use chrono::prelude::*;
use serde_json::{json, Value};
use calendar::Error;
use calendar::CalendarHub;
use actix_cors::Cors;
use actix_web::{get, web, App, HttpServer, Responder};

#[derive(Serialize, Deserialize)]
struct WordOfTheDay {
    meaning: String,
    sentence: String,
    source: String,
}

async fn get_hub() -> CalendarHub {
    let secret = yup_oauth2::read_application_secret("client_secret.json")
        .await
        .expect("client_secret.json");

    let auth = yup_oauth2::InstalledFlowAuthenticator::builder(
            secret,
            yup_oauth2::InstalledFlowReturnMethod::HTTPRedirect,
    )
    .persist_tokens_to_disk("tokencache.json")
    .build()
    .await
    .unwrap();    

    let scopes = &["https://www.googleapis.com/auth/calendar.events.readonly"];

    match auth.token(scopes).await {
        Ok(token) => println!("The token is {:?}", token),
        Err(e) => println!("error: {:?}", e)
    };
    let hub = CalendarHub::new(
        hyper::Client::builder().build(hyper_rustls::HttpsConnector::with_native_roots()),
        auth,
    );
    hub
}

async fn do_calendar_request(calendar_id: &str) -> Result<(hyper::Response<hyper::Body>, calendar::api::Events), calendar::Error> {
    let hub = get_hub().await;
    let result = hub.events().list(calendar_id)
                .single_events(true)
                .time_min(&Local::now().to_rfc3339().to_string())
                .order_by("startTime")
                .max_results(10).doit().await;
    result
}

fn get_result_json(result: Result<(hyper::Response<hyper::Body>, calendar::api::Events), calendar::Error>) -> Value {
    let mut value = json!({});
    match result {
        Err(e) => match e {
            // The Error enum provides details about what exactly happened.
            // You can also just use its `Debug`, `Display` or `Error` traits
            Error::HttpError(_)
            | Error::Io(_)
            | Error::MissingAPIKey
            | Error::MissingToken(_)
            | Error::Cancelled
            | Error::UploadSizeLimitExceeded(_, _)
            | Error::Failure(_)
            | Error::BadRequest(_)
            | Error::FieldClash(_)
            | Error::JsonDecodeError(_, _) => println!("{}", e),
        },
        Ok((_res, output_schema)) => {
            value = serde_json::value::to_value(&output_schema).expect("serde to work");
        },
    }
    value
}

#[get("/events")]
async fn events() -> impl Responder {
    let result = do_calendar_request("oa6guno8g7u5k4fs408m7jtgr0@group.calendar.google.com").await;
    let value = get_result_json(result);
    web::Json(value)
}

#[get("/birthdays")]
async fn birthdays() -> impl Responder {
    let result = do_calendar_request("6k1ro2oupeb1llrf2udjlhhnk0@group.calendar.google.com").await;
    let value = get_result_json(result);
    web::Json(value)   
}

#[get("/word-of-the-day")]
async fn word_of_the_day() -> impl Responder {
    let body = reqwest::get("http://www.merriam-webster.com/word-of-the-day")
            .await
            .unwrap()
            .text()
            .await;
    // println!("{:?}", body);
    let str_body = body.unwrap();
    let doc = Html::parse_document(&str_body);
    let selector = Selector::parse("div.wod-definition-container>p").unwrap();
    let el = doc.select(&selector).map(|element| element.inner_html());
    let mut word_set = WordOfTheDay {
        meaning: String::from(""),
        sentence: String::from(""),
        source: String::from("Merriam Webster"),
    };

    el.zip(0..2).for_each(|(item, index)| {
        if index == 0 {
            word_set.meaning = item;
        }
        else {
            word_set.sentence = item;
        }
    });
    web::Json(word_set)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    
    HttpServer::new(|| {
        App::new()
            .wrap(Cors::permissive())
            .service(events)
            .service(birthdays)
            .service(word_of_the_day)
    })
    .bind(("0.0.0.0", 8089))?
    .run()
    .await
}
