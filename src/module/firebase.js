export class fireBase {

    highScoreArray;

    constructor(highScoreArray) {
        this.highScoreArray = highScoreArray;
    }

    // GET Highscore array from database
    async getFirebase() {
        const url = "https://rockpaperscissors-50a62-default-rtdb.europe-west1.firebasedatabase.app/highScore.json";

        const response = await fetch(url);
        this.highScoreArray = await response.json();

        return this.highScoreArray;
    }

    // Update database
    async putToFireBase() {
        // const arr = [{ name: "Wijk", score: 10 }, { name: "Max", score: 3 }, { name: "Markus", score: 5 }, { name: "Deez", score: 6 }, { name: "Nutz", score: 9 }];

        const url = "https://rockpaperscissors-50a62-default-rtdb.europe-west1.firebasedatabase.app/highScore.json";

        const options = {
            method: "PUT",
            body: JSON.stringify(this.highScoreArray),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }

        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    }
}
