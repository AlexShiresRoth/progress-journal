import axios from 'axios';


export default class DaySearch {
    constructor(id){
        this.id = id;
    }

    async searchDays(){
        try {
            const response = await axios.get('http://localhost:3000/api/profiles');
            console.log(response)
        } catch (error) {
            console.log(error.message)
            if(error) throw error;
        }
    }
}

