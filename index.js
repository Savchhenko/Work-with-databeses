window.addEventListener('scroll', getData);
window.addEventListener('click', getData);
window.addEventListener('keypress', getData);

function getData(event) {
    var eventsName = event.type;
    console.log(eventsName);
    //I converted the time to seconds and rounded it up to two decimal places
    var timeResult = (event.timeStamp/1000).toFixed(2); 
    if(eventsName === "keypress") {
        console.log(`Time of the event keypress [${event.key}]: ${timeResult}`);
    } else if(eventsName === "click") {
        var coordX = event.screenX;
        var coordY = event.screenY;
        console.log('X =', coordX, 'Y =', coordY, `Time of the event ${eventsName}: ${timeResult}` );
    } else if(eventsName === 'scroll') {
        console.log(`The time of the event ${eventsName}: ${timeResult}`); 
    }

    var db; 
    let openRequest = indexedDB.open('MyDatabase', 1);

    openRequest.onerror = event => {
        console.log('open db request --- onerror');
        console.log('Error opening the database. Error code: ', event.target.errorCode);
        db = event.target.result;
    };
    openRequest.onsuccess = event => {
        console.log('open db --- onsuccess');
        db = event.target.result;
        addObjectToDb();
    };
    openRequest.onupgradeneeded = event => {
        console.log('open db --- onupgradeneeded');
        db = event.target.result;
        if (!db.objectStoreNames.contains('myStorage')) {
            db.createObjectStore('myStorage', {keyPath: 'id', autoIncrement: true});
        };
    };

    function addObjectToDb() {
        const transaction = db.transaction('myStorage', 'readwrite');
        const myStorage = transaction.objectStore('myStorage');
        console.log('Transaction happened ', myStorage);
    
        const eventObject = {
            time: timeResult, 
            eventName: eventsName, 
        };

        const eventObjectClick = {
            time: timeResult, 
            eventName: eventsName, 
            axisX: coordX,
            axisY: coordY,
        };
    
        if(eventsName === 'click') {
            var newRequest = myStorage.add(eventObjectClick);
            console.dir(newRequest);
        } else {
            var newRequest = myStorage.add(eventObject);
        }
        
        newRequest.onsuccess = () => {
            console.log('The object was written to the database');
        };
        newRequest.onerror = event => {
            console.log('Error writing to the database', event.target.error);
        };
    };
}






