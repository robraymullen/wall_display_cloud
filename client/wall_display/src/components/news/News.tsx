import { useEffect, useState } from "react";
import './News.css';
import "bootstrap/dist/css/bootstrap.min.css";

let currentSetIntervalId : any;
// let refreshIntervalId: any;
// let currentItemCounter = 0;

const styles = {
    item: {
        margin: "0"
    }
};

interface NewsItem {
    text: string;
    source: string;
}

function shuffle(items: NewsItem[]) {
    for (let i=items .length-1; i>0; i-- ){
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
}

function News() {
    const [wordOfTheDay, setWordOfTheDay] = useState<NewsItem>();
    const [currentItem, setCurrentItem] = useState<NewsItem>();
    let allItems: NewsItem[] = [];

    useEffect(() => {
        let redditIntervalId: any;
        let factIntervalId: any; 
        let wordIntervalId: any;

        

        const getFacts = async () => {
            const apiKey = "DKneXye2wzgNuhZ9Ay8a6A==ZtAzTQLEn9anuNKM";
            const factResponse = await fetch("https://api.api-ninjas.com/v1/facts?limit=50", {
            headers: {
                'X-Api-Key': apiKey
                }
            });
            const factJson = await factResponse.json();
            return factJson.map((resultItem: any) => { return {text: resultItem.fact, source: "Daily Facts"}; });
        };

        const getRedditPosts = async () => {
            const redditPostJson = await Promise.all([
                fetch("https://www.reddit.com/r/worldnews/best.json?sort=new"), 
                fetch("https://www.reddit.com/r/science/best.json?sort=new")
            ]).then(([worldNewsRes, scienceNewsRes]) =>
                Promise.all([worldNewsRes.json(), scienceNewsRes.json()])
            );
            const worldItems = redditPostJson[0].data.children.filter((child:any) => !child.data.stickied).map((child:any) => {
                let item: NewsItem = {
                    text: child.data.title,
                    source: child.data.subreddit_name_prefixed
                };
                return item;
            });
            const scienceItems = redditPostJson[1].data.children.filter((child:any) => !child.data.stickied).map((child:any) => {
                let item: NewsItem = {
                    text: child.data.title,
                    source: child.data.subreddit_name_prefixed
                };
                return item;
            });
            return [...scienceItems, ...worldItems];
        };

        const getWordOfTheDay = async () => {
            const wordResponse = await fetch("/api/word-of-the-day");
            const wordJson = await wordResponse.json();
            setWordOfTheDay({
                text: wordJson.meaning,
                source: "Word of the Day"
            });
        };

        const  startItemChangeLoop = async () => {
            let redditPosts = await getRedditPosts();
            let wordOfTheDay = await getWordOfTheDay();
            let facts = await getFacts();
            clearInterval(currentSetIntervalId);
            allItems = [...redditPosts, ...facts, wordOfTheDay];
            shuffle(allItems);
            setCurrentItem(allItems.pop());
            currentSetIntervalId = setInterval(async () => {
                if (allItems.length > 0) {
                    setCurrentItem(allItems.pop());
                } else {
                    redditPosts = await getRedditPosts();
                    wordOfTheDay = await getWordOfTheDay();
                    facts = await getFacts();
                    allItems = [...redditPosts, ...facts, wordOfTheDay];
                    shuffle(allItems);
                    setCurrentItem(allItems.pop());
                }
                
            }, 20000);
        };

        startItemChangeLoop();
        
        return () => {
            clearInterval(currentSetIntervalId);
            clearInterval(factIntervalId);
            clearInterval(redditIntervalId);
            clearInterval(wordIntervalId);
        }
    }, []);

    return (
        <div>
            <h1 style={styles.item} className="newsText">{currentItem?.text}</h1>
                <h6>{currentItem?.source}</h6>
        </div>
    )
}

export default News;